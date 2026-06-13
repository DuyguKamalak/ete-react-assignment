import { useMemo, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  Popconfirm,
  Select,
  InputNumber,
  Tag,
  App as AntApp,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { productsApi, companiesApi } from '../api/resources';
import { getErrorMessage } from '../api/client';
import { exportToCsv } from '../utils/csv';
import type { Product, ProductInput } from '../types';

export function Products() {
  const qc = useQueryClient();
  const { t } = useTranslation();
  const { message } = AntApp.useApp();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [companyFilter, setCompanyFilter] = useState<number | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form] = Form.useForm<ProductInput>();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productsApi.list,
  });
  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: companiesApi.list,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['products'] });
    qc.invalidateQueries({ queryKey: ['stats'] });
  };

  const saveMutation = useMutation({
    mutationFn: (values: ProductInput) =>
      editing ? productsApi.update(editing.id, values) : productsApi.create(values),
    onSuccess: () => {
      message.success(editing ? t('product.updated') : t('product.created'));
      setModalOpen(false);
      setEditing(null);
      form.resetFields();
      invalidate();
    },
    onError: (e) => message.error(getErrorMessage(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productsApi.remove(id),
    onSuccess: () => {
      message.success(t('product.deleted'));
      invalidate();
    },
    onError: (e) => message.error(getErrorMessage(e)),
  });

  const openCreate = () => {
    if (!companies.length) {
      message.warning(t('product.addCompanyFirst'));
      return;
    }
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    form.setFieldsValue({
      name: product.name,
      category: product.category,
      amount: product.amount,
      amountUnit: product.amountUnit,
      companyId: product.companyId,
    });
    setModalOpen(true);
  };

  const categoryOptions = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.category)))
        .sort((a, b) => a.localeCompare(b))
        .map((c) => ({ label: c, value: c })),
    [products]
  );
  const companyOptions = useMemo(
    () => companies.map((c) => ({ label: c.name, value: c.id })),
    [companies]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = !categoryFilter || p.category === categoryFilter;
      const matchesCompany = !companyFilter || p.companyId === companyFilter;
      const matchesSearch =
        !q ||
        [p.name, p.category, p.amountUnit, p.company?.name ?? '']
          .join(' ')
          .toLowerCase()
          .includes(q);
      return matchesCategory && matchesCompany && matchesSearch;
    });
  }, [products, search, categoryFilter, companyFilter]);

  const columns: ColumnsType<Product> = [
    { title: t('product.name'), dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    {
      title: t('product.category'),
      dataIndex: 'category',
      sorter: (a, b) => a.category.localeCompare(b.category),
      render: (c: string) => <Tag color="blue">{c}</Tag>,
    },
    {
      title: t('product.amount'),
      dataIndex: 'amount',
      align: 'right',
      sorter: (a, b) => a.amount - b.amount,
      render: (amount: number, record) => `${amount.toLocaleString()} ${record.amountUnit}`,
    },
    {
      title: t('product.company'),
      dataIndex: ['company', 'name'],
      sorter: (a, b) => (a.company?.name ?? '').localeCompare(b.company?.name ?? ''),
      render: (_, record) => record.company?.name ?? '—',
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 140,
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm
            title={t('product.deleteConfirm')}
            okText={t('common.delete')}
            okButtonProps={{ danger: true }}
            onConfirm={() => deleteMutation.mutate(record.id)}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }} wrap>
        <Space wrap>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder={t('product.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 240 }}
          />
          <Select
            allowClear
            placeholder={t('product.allCategories')}
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={categoryOptions}
            style={{ width: 180 }}
          />
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder={t('product.allCompanies')}
            value={companyFilter}
            onChange={setCompanyFilter}
            options={companyOptions}
            style={{ width: 200 }}
          />
        </Space>
        <Space>
          <Button
            icon={<DownloadOutlined />}
            disabled={!filtered.length}
            onClick={() =>
              exportToCsv(
                'products.csv',
                filtered.map((p) => ({ ...p, companyName: p.company?.name ?? '' })),
                [
                  { key: 'name', label: 'Name' },
                  { key: 'category', label: 'Category' },
                  { key: 'amount', label: 'Amount' },
                  { key: 'amountUnit', label: 'Unit' },
                  { key: 'companyName', label: 'Company' },
                ]
              )
            }
          >
            {t('common.exportCsv')}
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            {t('product.addBtn')}
          </Button>
        </Space>
      </Space>

      <Table
        rowKey="id"
        loading={isLoading}
        columns={columns}
        dataSource={filtered}
        pagination={{
          pageSize: 8,
          showSizeChanger: true,
          showTotal: (total) => t('product.total', { count: total }),
        }}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        title={editing ? t('product.editModal') : t('product.addModal')}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={saveMutation.isPending}
        okText={editing ? t('common.save') : t('common.create')}
        cancelText={t('common.cancel')}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => saveMutation.mutate(values)}
          requiredMark="optional"
        >
          <Form.Item
            name="name"
            label={t('product.name')}
            rules={[{ required: true, message: t('product.nameRule') }]}
          >
            <Input placeholder="Widget" />
          </Form.Item>
          <Form.Item
            name="category"
            label={t('product.category')}
            rules={[{ required: true, message: t('product.categoryRule') }]}
          >
            <Input placeholder="Electronics" />
          </Form.Item>
          <Space style={{ display: 'flex' }} align="start">
            <Form.Item
              name="amount"
              label={t('product.amount')}
              rules={[{ required: true, message: t('product.amountRule') }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} placeholder="100" />
            </Form.Item>
            <Form.Item
              name="amountUnit"
              label={t('product.unit')}
              rules={[{ required: true, message: t('product.unitRule') }]}
            >
              <Input placeholder="pcs / kg / m" />
            </Form.Item>
          </Space>
          <Form.Item
            name="companyId"
            label={t('product.company')}
            rules={[{ required: true, message: t('product.companyRule') }]}
          >
            <Select
              placeholder={t('product.selectCompany')}
              showSearch
              optionFilterProp="label"
              options={companies.map((c) => ({ label: c.name, value: c.id }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
