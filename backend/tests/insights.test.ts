import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../src/app';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.employee.createMany({
    data: [
      { fullName: 'Alice Smith', jobTitle: 'Engineer', country: 'USA', salary: 80000 },
      { fullName: 'Bob Jones', jobTitle: 'Engineer', country: 'USA', salary: 90000 },
      { fullName: 'Carol Lee', jobTitle: 'Engineer', country: 'India', salary: 30000 },
      { fullName: 'David Kim', jobTitle: 'Designer', country: 'India', salary: 25000 },
      { fullName: 'Eve Wang', jobTitle: 'Designer', country: 'India', salary: 35000 },
    ],
  });
});

afterAll(async () => {
  await prisma.employee.deleteMany();
  await prisma.$disconnect();
});

describe('GET /api/insights/by-country', () => {
  it('should return salary insights grouped by country', async () => {
    const res = await request(app).get('/api/insights/by-country');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const usa = res.body.find((i: any) => i.country === 'USA');
    expect(usa).toBeDefined();
    expect(usa.minSalary).toBe(80000);
    expect(usa.maxSalary).toBe(90000);
    expect(usa.avgSalary).toBe(85000);
    expect(usa.employeeCount).toBe(2);

    const india = res.body.find((i: any) => i.country === 'India');
    expect(india).toBeDefined();
    expect(india.minSalary).toBe(25000);
    expect(india.maxSalary).toBe(35000);
    expect(india.employeeCount).toBe(3);
  });
});

describe('GET /api/insights/by-job-title', () => {
  it('should return avg salary by job title when no country filter', async () => {
    const res = await request(app).get('/api/insights/by-job-title');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const designerIndia = res.body.find(
      (i: any) => i.jobTitle === 'Designer' && i.country === 'India'
    );
    expect(designerIndia).toBeDefined();
    expect(designerIndia.avgSalary).toBe(30000);
    expect(designerIndia.employeeCount).toBe(2);
  });

  it('should filter by country when query param provided', async () => {
    const res = await request(app).get('/api/insights/by-job-title?country=USA');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].country).toBe('USA');
    expect(res.body[0].avgSalary).toBe(85000);
  });
});