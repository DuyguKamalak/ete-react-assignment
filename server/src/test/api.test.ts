import request from 'supertest';
import { createApp } from '../app';
import { sequelize } from '../models';

const app = createApp();
let token: string;

beforeAll(async () => {
  await sequelize.sync({ force: true });
  const res = await request(app)
    .post('/api/auth/register')
    .send({ username: 'tester', password: 'secret123' });
  token = res.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

const auth = () => ({ Authorization: `Bearer ${token}` });

describe('Companies & Products API', () => {
  let companyId: number;

  it('blocks unauthenticated access', async () => {
    await request(app).get('/api/companies').expect(401);
  });

  it('creates and lists a company', async () => {
    const created = await request(app)
      .post('/api/companies')
      .set(auth())
      .send({
        name: 'Test Co',
        legalNumber: 'TR-9999',
        incorporationCountry: 'Türkiye',
        website: 'https://test.example.com',
      })
      .expect(201);

    companyId = created.body.id;
    expect(created.body.name).toBe('Test Co');

    const list = await request(app).get('/api/companies').set(auth()).expect(200);
    expect(list.body).toHaveLength(1);
  });

  it('rejects an invalid company (missing legal number)', async () => {
    await request(app)
      .post('/api/companies')
      .set(auth())
      .send({ name: 'Bad Co', incorporationCountry: 'Türkiye' })
      .expect(400);
  });

  it('rejects a product referencing a non-existent company', async () => {
    await request(app)
      .post('/api/products')
      .set(auth())
      .send({ name: 'Ghost', category: 'X', amount: 1, amountUnit: 'pcs', companyId: 99999 })
      .expect(400);
  });

  it('creates a product linked to a company and returns the company relation', async () => {
    const res = await request(app)
      .post('/api/products')
      .set(auth())
      .send({ name: 'Widget', category: 'Hardware', amount: 10, amountUnit: 'pcs', companyId })
      .expect(201);

    expect(res.body.name).toBe('Widget');
    expect(res.body.company.id).toBe(companyId);
  });

  it('fetches a single company by id', async () => {
    const res = await request(app).get(`/api/companies/${companyId}`).set(auth()).expect(200);
    expect(res.body.id).toBe(companyId);
    expect(res.body.name).toBe('Test Co');
  });

  it('returns 404 for a missing company', async () => {
    await request(app).get('/api/companies/99999').set(auth()).expect(404);
  });

  it('reflects created data in dashboard stats', async () => {
    const res = await request(app).get('/api/stats').set(auth()).expect(200);
    expect(res.body.totalCompanies).toBe(1);
    expect(res.body.totalProducts).toBe(1);
    expect(res.body.latestCompanies[0].name).toBe('Test Co');
  });

  it('cascades product deletion when its company is removed', async () => {
    await request(app).delete(`/api/companies/${companyId}`).set(auth()).expect(204);
    const products = await request(app).get('/api/products').set(auth()).expect(200);
    expect(products.body).toHaveLength(0);
  });
});
