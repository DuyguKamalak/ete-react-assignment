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
import { productsApi, companiesApi } from '../api/resources';
import { getErrorMessage } from '../api/client';
import { exportToCsv } from '../utils/csv';
import type { Product, ProductInput } from '../types';

export function Products() {
  const qc = useQueryClient();
  const { message } = AntApp.useApp();
  const [search, setSearch] = useState('');
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
      message.success(editing ? 'Product updated' : 'Product created');
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
      message.success('Product deleted');
      invalidate();
    },
    onError: (e) => message.error(getErrorMessage(e)),
  });

  const openCreate = () => {
    if (!companies.length) {
      message.warning('Please add a company first');
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

  const categoryFilters = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).map((c) => ({ text: c, value: c })),
    [products]
  );
  const companyFilters = useMemo(
    () => companies.map((c) => ({ text: c.name, value: c.id })),
    [companies]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name, p.category, p.amountUnit, p.company?.name ?? '']
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [products, search]);

  const columns: ColumnsType<Product> = [
    { title: 'Name', dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    {
      title: 'Category',
      dataIndex: 'category',
      filters: categoryFilters,
      onFilter: (value, record) => record.category === value,
      render: (c: string) => <Tag color="blue">{c}</Tag>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      align: 'right',
      sorter: (a, b) => a.amount - b.amount,
      render: (amount: number, record) => `${amount.toLocaleString()} ${record.amountUnit}`,
    },
    {
      title: 'Company',
      dataIndex: ['company', 'name'],
      filters: companyFilters,
      onFilter: (value, record) => record.companyId === value,
      render: (_, record) => record.company?.name ?? '—',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm
            title="Delete this product?"
            okText="Delete"
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
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 260 }}
        />
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
            Export CSV
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Add Product
          </Button>
        </Space>
      </Space>

      <Table
        rowKey="id"
        loading={isLoading}
        columns={columns}
        dataSource={filtered}
        pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (t) => `${t} products` }}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        title={editing ? 'Edit Product' : 'Add Product'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={saveMutation.isPending}
        okText={editing ? 'Save' : 'Create'}
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
            label="Product Name"
            rules={[{ required: true, message: 'Product name is required' }]}
          >
            <Input placeholder="Widget" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Category is required' }]}
          >
            <Input placeholder="Electronics" />
          </Form.Item>
          <Space style={{ display: 'flex' }} align="start">
            <Form.Item
              name="amount"
              label="Amount"
              rules={[{ required: true, message: 'Amount is required' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} placeholder="100" />
            </Form.Item>
            <Form.Item
              name="amountUnit"
              label="Unit"
              rules={[{ required: true, message: 'Unit is required' }]}
            >
              <Input placeholder="pcs / kg / m" />
            </Form.Item>
          </Space>
          <Form.Item
            name="companyId"
            label="Company"
            rules={[{ required: true, message: 'Company is required' }]}
          >
            <Select
              placeholder="Select a company"
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
