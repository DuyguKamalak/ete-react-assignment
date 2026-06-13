import { Row, Col, Card, Statistic, List, Tag, Empty, Spin, Alert, Typography } from 'antd';
import { BankOutlined, AppstoreOutlined, TagsOutlined, GlobalOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { statsApi } from '../api/resources';
import { getErrorMessage } from '../api/client';

const PIE_COLORS = ['#1677ff', '#52c41a', '#faad14', '#eb2f96', '#13c2c2', '#722ed1'];

export function Dashboard() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['stats'],
    queryFn: statsApi.dashboard,
  });

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !data) {
    return <Alert type="error" message={getErrorMessage(error, 'Failed to load dashboard')} />;
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={12} md={6}>
          <Card>
            <Statistic
              title="Companies"
              value={data.totalCompanies}
              prefix={<BankOutlined />}
            />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              There are {data.totalCompanies} companies in the system
            </Typography.Text>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic
              title="Products"
              value={data.totalProducts}
              prefix={<AppstoreOutlined />}
            />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Across {data.distinctCategories} categories
            </Typography.Text>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic title="Categories" value={data.distinctCategories} prefix={<TagsOutlined />} />
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Statistic title="Countries" value={data.distinctCountries} prefix={<GlobalOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="Products by category">
            {data.productsByCategory.length === 0 ? (
              <Empty />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.productsByCategory}>
                  <XAxis dataKey="category" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1677ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Companies by country">
            {data.companiesByCountry.length === 0 ? (
              <Empty />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={data.companiesByCountry}
                    dataKey="count"
                    nameKey="country"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={(entry) => entry.country}
                  >
                    {data.companiesByCountry.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="Lastly added companies">
            <List
              dataSource={data.latestCompanies}
              locale={{ emptyText: <Empty /> }}
              renderItem={(c) => (
                <List.Item
                  actions={[<Tag key="country">{c.incorporationCountry}</Tag>]}
                >
                  <List.Item.Meta
                    title={c.name}
                    description={`Legal No: ${c.legalNumber}`}
                  />
                  <Typography.Text type="secondary">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </Typography.Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
