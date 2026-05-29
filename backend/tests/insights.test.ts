import request from 'supertest';
import prisma from '../src/services/prisma';
import app from '../src/app';

beforeAll(async () => {
  await prisma.employee.deleteMany({ where: { fullName: { startsWith: 'TEST_' } } });
  await prisma.employee.createMany({
    data: [
      { fullName: 'TEST_Alice_Smith', jobTitle: 'Engineer', country: 'USA', salary: 80000 },
      { fullName: 'TEST_Bob_Jones', jobTitle: 'Engineer', country: 'USA', salary: 90000 },
      { fullName: 'TEST_Carol_Lee', jobTitle: 'Engineer', country: 'India', salary: 30000 },
      { fullName: 'TEST_David_Kim', jobTitle: 'Designer', country: 'India', salary: 25000 },
      { fullName: 'TEST_Eve_Wang', jobTitle: 'Designer', country: 'India', salary: 35000 },
    ],
  });
});

afterAll(async () => {
  await prisma.employee.deleteMany({ where: { fullName: { startsWith: 'TEST_' } } });
  await prisma.$disconnect();
});

describe('GET /api/insights/by-country', () => {
  it('should return salary insights grouped by country', async () => {
    const res = await request(app).get('/api/insights/by-country');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const usa = res.body.find((i: any) => i.country === 'USA');
    expect(usa).toBeDefined();
    expect(usa.minSalary).toBeDefined();
    expect(usa.employeeCount).toBe(2);

    const india = res.body.find((i: any) => i.country === 'India');
    expect(india).toBeDefined();
    expect(india.employeeCount).toBeGreaterThanOrEqual(3);
  });
});

describe('GET /api/insights/by-job-title', () => {
  it('should return paginated response with data array', async () => {
    const res = await request(app).get('/api/insights/by-job-title');
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.total).toBeGreaterThanOrEqual(3);
  });

  it('should filter by country when query param provided', async () => {
    const res = await request(app).get('/api/insights/by-job-title?country=USA');
    expect(res.status).toBe(200);
    expect(res.body.data.every((i: any) => i.country === 'USA')).toBe(true);
  });

  it('should honor pagination params', async () => {
    const res = await request(app).get('/api/insights/by-job-title?page=1&limit=2');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(2);
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.limit).toBe(2);
  });
});

describe('GET /api/insights/stats', () => {
  it('should return overall salary stats', async () => {
    const res = await request(app).get('/api/insights/stats');
    expect(res.status).toBe(200);
    expect(res.body.totalEmployees).toBeGreaterThanOrEqual(5);
    expect(res.body.overallAvgSalary).toBeGreaterThan(0);
    expect(res.body.totalCountries).toBeGreaterThanOrEqual(2);
    expect(res.body.totalJobTitles).toBeGreaterThanOrEqual(2);
  });
});