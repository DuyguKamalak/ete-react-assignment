import { useMemo, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  Modal,
  Form,
  Popconfirm,
  Typography,
  App as AntApp,
  Tag,
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
import { companiesApi } from '../api/resources';
import { getErrorMessage } from '../api/client';
import { exportToCsv } from '../utils/csv';
import type { Company, CompanyInput } from '../types';

export function Companies() {
  const qc = useQueryClient();
  const { t } = useTranslation();
  const { message } = AntApp.useApp();
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState<string | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [form] = Form.useForm<CompanyInput>();

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: companiesApi.list,
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['companies'] });
    qc.invalidateQueries({ queryKey: ['stats'] });
  };

  const saveMutation = useMutation({
    mutationFn: (values: CompanyInput) =>
      editing ? companiesApi.update(editing.id, values) : companiesApi.create(values),
    onSuccess: () => {
      message.success(editing ? t('company.updated') : t('company.created'));
      setModalOpen(false);
      setEditing(null);
      form.resetFields();
      invalidate();
    },
    onError: (e) => message.error(getErrorMessage(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => companiesApi.remove(id),
    onSuccess: () => {
      message.success(t('company.deleted'));
      invalidate();
    },
    onError: (e) => message.error(getErrorMessage(e)),
  });

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (company: Company) => {
    setEditing(company);
    form.setFieldsValue(company);
    setModalOpen(true);
  };

  const countryOptions = useMemo(
    () =>
      Array.from(new Set(companies.map((c) => c.incorporationCountry)))
        .sort((a, b) => a.localeCompare(b))
        .map((c) => ({ label: c, value: c })),
    [companies]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return companies.filter((c) => {
      const matchesCountry = !countryFilter || c.incorporationCountry === countryFilter;
      const matchesSearch =
        !q ||
        [c.name, c.legalNumber, c.incorporationCountry, c.website ?? '']
          .join(' ')
          .toLowerCase()
          .includes(q);
      return matchesCountry && matchesSearch;
    });
  }, [companies, search, countryFilter]);

  const columns: ColumnsType<Company> = [
    {
      title: t('company.name'),
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t('company.legalNumber'),
      dataIndex: 'legalNumber',
      sorter: (a, b) => a.legalNumber.localeCompare(b.legalNumber),
    },
    {
      title: t('company.country'),
      dataIndex: 'incorporationCountry',
      sorter: (a, b) => a.incorporationCountry.localeCompare(b.incorporationCountry),
      render: (country: string) => <Tag>{country}</Tag>,
    },
    {
      title: t('company.website'),
      dataIndex: 'website',
      render: (website: string | null) =>
        website ? (
          <a href={website} target="_blank" rel="noreferrer">
            {website}
          </a>
        ) : (
          <Typography.Text type="secondary">—</Typography.Text>
        ),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 140,
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm
            title={t('company.deleteConfirm')}
            description={t('company.deleteDesc')}
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
            placeholder={t('company.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 260 }}
          />
          <Select
            allowClear
            placeholder={t('company.allCountries')}
            value={countryFilter}
            onChange={setCountryFilter}
            options={countryOptions}
            style={{ width: 200 }}
          />
        </Space>
        <Space>
          <Button
            icon={<DownloadOutlined />}
            disabled={!filtered.length}
            onClick={() =>
              exportToCsv('companies.csv', filtered, [
                { key: 'name', label: 'Name' },
                { key: 'legalNumber', label: 'Legal Number' },
                { key: 'incorporationCountry', label: 'Country' },
                { key: 'website', label: 'Website' },
              ])
            }
          >
            {t('common.exportCsv')}
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            {t('company.addBtn')}
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
          showTotal: (total) => t('company.total', { count: total }),
        }}
        scroll={{ x: 'max-content' }}
      />

      <Modal
        title={editing ? t('company.editModal') : t('company.addModal')}
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
            label={t('company.name')}
            rules={[{ required: true, message: t('company.nameRule') }]}
          >
            <Input placeholder="Acme Inc." />
          </Form.Item>
          <Form.Item
            name="legalNumber"
            label={t('company.legalNumber')}
            rules={[{ required: true, message: t('company.legalRule') }]}
          >
            <Input placeholder="TR-1234" />
          </Form.Item>
          <Form.Item
            name="incorporationCountry"
            label={t('company.country')}
            rules={[{ required: true, message: t('company.countryRule') }]}
          >
            <Input placeholder="Türkiye" />
          </Form.Item>
          <Form.Item
            name="website"
            label={t('company.website')}
            rules={[{ type: 'url', message: t('company.urlRule') }]}
          >
            <Input placeholder="https://example.com" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
