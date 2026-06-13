import { Card, Descriptions, Button, Table, Tag, Spin, Alert, Space, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { companiesApi, productsApi } from '../api/resources';
import { getErrorMessage } from '../api/client';
import type { Product } from '../types';

export function CompanyDetail() {
  const { id } = useParams();
  const companyId = Number(id);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const companyQuery = useQuery({
    queryKey: ['company', companyId],
    queryFn: () => companiesApi.get(companyId),
  });
  const productsQuery = useQuery({ queryKey: ['products'], queryFn: productsApi.list });

  if (companyQuery.isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (companyQuery.isError || !companyQuery.data) {
    return <Alert type="error" message={getErrorMessage(companyQuery.error)} />;
  }

  const company = companyQuery.data;
  const products = (productsQuery.data ?? []).filter((p) => p.companyId === companyId);

  const columns: ColumnsType<Product> = [
    {
      title: t('product.name'),
      dataIndex: 'name',
      render: (_, record) => <Link to={`/products/${record.id}`}>{record.name}</Link>,
    },
    {
      title: t('product.category'),
      dataIndex: 'category',
      render: (c: string) => <Tag color="blue">{c}</Tag>,
    },
    {
      title: t('product.amount'),
      dataIndex: 'amount',
      align: 'right',
      render: (amount: number, record) => `${amount.toLocaleString()} ${record.amountUnit}`,
    },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/companies')}>
        {t('common.back')}
      </Button>

      <Card title={t('company.detailTitle')}>
        <Descriptions column={{ xs: 1, sm: 2 }} bordered>
          <Descriptions.Item label={t('company.name')}>{company.name}</Descriptions.Item>
          <Descriptions.Item label={t('company.legalNumber')}>{company.legalNumber}</Descriptions.Item>
          <Descriptions.Item label={t('company.country')}>
            <Tag>{company.incorporationCountry}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('company.website')}>
            {company.website ? (
              <a href={company.website} target="_blank" rel="noreferrer">
                {company.website}
              </a>
            ) : (
              <Typography.Text type="secondary">—</Typography.Text>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title={t('company.productsOf', { name: company.name })}>
        <Table
          rowKey="id"
          loading={productsQuery.isLoading}
          columns={columns}
          dataSource={products}
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </Space>
  );
}
