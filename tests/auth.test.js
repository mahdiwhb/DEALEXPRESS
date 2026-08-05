const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');

jest.mock('../src/models/user', () => ({
  findOne: jest.fn(),
}));

describe('Auth routes', () => {
  beforeEach(() => {
    User.findOne.mockReset();
  });

  it('should reject registration with missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.statusCode).toBe(400);
  });

  it('should reject login with wrong credentials', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app).post('/api/auth/login').send({
      email: 'inexistant@test.com',
      password: 'wrongpassword',
    });
    expect(res.statusCode).toBe(400);
  });

  it('should reject access to protected route without token', async () => {
    const res = await request(app).post('/api/deals').send({
      title: 'Test DEAL',
      description: 'Desc',
      price: 10,
      originalPrice: 15,
      url: 'http://example.com',
      category: 'test',
    });
    expect(res.statusCode).toBe(401);
  });
});
