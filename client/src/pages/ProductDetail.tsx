import { Card, Descriptions, Button, Tag, Spin, Alert, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productsApi } from '../api/resources';
import { getErrorMessage } from '../api/client';

export function ProductDetail() {
  const { id } = useParams();
  const productId = Number(id);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsApi.get(productId),
  });

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !data) {
    return <Alert type="error" message={getErrorMessage(error)} />;
  }

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/products')}>
        {t('common.back')}
      </Button>

      <Card title={t('product.detailTitle')}>
        <Descriptions column={{ xs: 1, sm: 2 }} bordered>
          <Descriptions.Item label={t('product.name')}>{data.name}</Descriptions.Item>
          <Descriptions.Item label={t('product.category')}>
            <Tag color="blue">{data.category}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('product.amount')}>
            {data.amount.toLocaleString()} {data.amountUnit}
          </Descriptions.Item>
          <Descriptions.Item label={t('product.company')}>
            {data.company ? (
              <Link to={`/companies/${data.company.id}`}>{data.company.name}</Link>
            ) : (
              '—'
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Space>
  );
}
