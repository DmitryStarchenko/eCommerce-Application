import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import { AppModule } from '../src/app.module';

describe('UI Scenarios (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ========== 1. CATALOG & CATEGORIES ==========

  it('01 - Health check returns ok', async () => {
    const res = await supertest(app.getHttpServer()).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('02 - Catalog returns 18 products', async () => {
    const res = await supertest(app.getHttpServer())
      .get('/api/products')
      .query({ limit: 20, offset: 0 });
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(18);
  });

  it('03 - Categories returns 4 categories', async () => {
    const res = await supertest(app.getHttpServer()).get('/api/categories');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(4);
    const ids = res.body
      .map((c: { id: string }) => c.id)
      .sort()
      .join(',');
    expect(ids).toBe('bus-cat,pickup-cat,sedan-cat,sports-cat');
  });

  it('04 - Product detail rush-rio', async () => {
    const res = await supertest(app.getHttpServer()).get(
      '/api/products/rush-rio',
    );
    expect(res.status).toBe(200);
    expect(res.body.key).toBe('rush-rio');
    const price =
      res.body.masterData.current.masterVariant.prices[0].value.centAmount;
    expect(price).toBeDefined();
  });

  // ========== 2. FILTERS, SEARCH, SORT ==========

  it('05 - Price filter (0-3000000)', async () => {
    const res = await supertest(app.getHttpServer())
      .get('/api/products/search')
      .query({ filter: 'variants.price.centAmount:range(0 to 3000000)' });
    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
  });

  it('06 - Category filter (sedan-cat)', async () => {
    const res = await supertest(app.getHttpServer())
      .get('/api/products/search')
      .query({ filter: 'categories.id:"sedan-cat"' });
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(4);
  });

  it('07 - Fuel filter (diesel)', async () => {
    const res = await supertest(app.getHttpServer())
      .get('/api/products/search')
      .query({ filter: 'variants.attributes.Fuel:"diesel"' });
    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
  });

  it('08 - Sort by price asc', async () => {
    const res = await supertest(app.getHttpServer())
      .get('/api/products/search')
      .query({ sort: 'price asc', limit: 3 });
    expect(res.status).toBe(200);
    const prices = res.body.results.map(
      (p: {
        masterData: {
          current: {
            masterVariant: { prices: { value: { centAmount: number } }[] };
          };
        };
      }) => p.masterData.current.masterVariant.prices[0].value.centAmount,
    );
    expect(prices[0]).toBeLessThanOrEqual(prices[1]);
  });

  it('09 - Fuzzy search pickup', async () => {
    const res = await supertest(app.getHttpServer())
      .get('/api/products/search')
      .query({ fuzzy: 'true', 'text.en-US': 'pickup' });
    expect(res.status).toBe(200);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
  });

  // ========== 3. ANONYMOUS TOKEN + CART + PROMO ==========

  let anonToken: string;
  let cartId: string;
  let cartVersion: number;

  it('10 - Anonymous token', async () => {
    const res = await supertest(app.getHttpServer())
      .post('/api/auth/anonymous/token')
      .send({});
    expect(res.status).toBe(201);
    expect(res.body.access_token).toBeDefined();
    anonToken = res.body.access_token;
  });

  it('11 - Create cart with anonymous token', async () => {
    const res = await supertest(app.getHttpServer())
      .post('/api/carts')
      .set('Authorization', `Bearer ${anonToken}`)
      .send({ currency: 'USD' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    cartId = res.body.id;
    cartVersion = res.body.version;
  });

  it('12 - Add line item (quantity=2)', async () => {
    const res = await supertest(app.getHttpServer())
      .post(`/api/carts/${cartId}`)
      .set('Authorization', `Bearer ${anonToken}`)
      .send({
        version: cartVersion,
        actions: [
          {
            action: 'addLineItem',
            productId: '1bdb1509-8cd8-4908-9001-441aefcaa890',
            quantity: 2,
          },
        ],
      });
    expect(res.status).toBe(201);
    expect(res.body.lineItems).toHaveLength(1);
    expect(res.body.lineItems[0].quantity).toBe(2);
    cartVersion = res.body.version;
  });

  it('13 - Apply promo FaRY (7%)', async () => {
    const res = await supertest(app.getHttpServer())
      .post(`/api/carts/${cartId}`)
      .set('Authorization', `Bearer ${anonToken}`)
      .send({
        version: cartVersion,
        actions: [{ action: 'addDiscountCode', code: 'FaRY' }],
      });
    expect(res.status).toBe(201);
    expect(res.body.discountOnTotalPrice).toBeDefined();
    cartVersion = res.body.version;
  });

  it('14 - Delete cart', async () => {
    const res = await supertest(app.getHttpServer())
      .delete(`/api/carts/${cartId}`)
      .set('Authorization', `Bearer ${anonToken}`);
    expect(res.status).toBe(200);
  });

  // ========== 4. REGISTRATION, LOGIN, PROFILE ==========

  let userToken: string;
  let userId: string;
  let userVersion: number;
  const testEmail = `final-test-${Date.now()}@test.com`;

  it('15 - Register new user', async () => {
    const res = await supertest(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: testEmail,
        password: 'Test1234!',
        firstName: 'Final',
        lastName: 'User',
        dateOfBirth: '1990-01-01',
        addresses: [
          {
            country: 'US',
            city: 'New York',
            streetName: 'Broadway',
            streetNumber: '1',
            postalCode: '10001',
          },
        ],
      });
    expect(res.status).toBe(201);
    expect(res.body.customer).toBeDefined();
    userToken = res.body.tokens.access_token;
    userId = res.body.customer.id;
    userVersion = res.body.customer.version;
  });

  it('16 - Login', async () => {
    const res = await supertest(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'Test1234!' });
    expect(res.status).toBe(201);
    expect(res.body.customer).toBeDefined();
    userToken = res.body.tokens.access_token;
    userId = res.body.customer.id;
  });

  it('17 - Get profile', async () => {
    const res = await supertest(app.getHttpServer())
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(userId);
    expect(res.body.email).toBe(testEmail);
  });

  it('18 - Update profile (setFirstName)', async () => {
    const res = await supertest(app.getHttpServer())
      .post(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        version: userVersion,
        actions: [{ action: 'setFirstName', firstName: 'UpdatedFinal' }],
      });
    expect(res.status).toBe(201);
    expect(res.body.firstName).toBe('UpdatedFinal');
    userVersion = res.body.version;
  });

  it('19 - Change password', async () => {
    const res = await supertest(app.getHttpServer())
      .post('/api/auth/change-password')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        id: userId,
        version: userVersion,
        currentPassword: 'Test1234!',
        newPassword: 'NewPass123!',
      });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  it('20 - Login with new password', async () => {
    const res = await supertest(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'NewPass123!' });
    expect(res.status).toBe(201);
    expect(res.body.customer).toBeDefined();
  });
});
