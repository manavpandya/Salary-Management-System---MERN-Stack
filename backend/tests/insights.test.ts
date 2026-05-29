import request from 'supertest';
import prisma from '../src/services/prisma';
import app from '../src/app';

beforeAll(async () => {
  // Use a unique test prefix to avoid conflict with seed data
  await prisma.employee.deleteMany({
    where: { fullName: { startsWith: 'TEST_' } }
  });
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
  await prisma.employee.deleteMany({
    where: { fullName: { startsWith: 'TEST_' } }
  });
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
    expect(usa.employeeCount).toBeGreaterThanOrEqual(2);

    const india = res.body.find((i: any) => i.country === 'India');
    expect(india).toBeDefined();
    expect(india.employeeCount).toBeGreaterThanOrEqual(3);
  });
});

describe('GET /api/insights/by-job-title', () => {
  it('should return avg salary by job title', async () => {
    const res = await request(app).get('/api/insights/by-job-title');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should filter by country when query param provided', async () => {
    const res = await request(app).get('/api/insights/by-job-title?country=USA');
    expect(res.status).toBe(200);
    expect(res.body.every((i: any) => i.country === 'USA')).toBe(true);
  });
});