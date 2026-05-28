import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../src/app';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.employee.createMany({
    data: [
      { fullName: 'Test Employee 1', jobTitle: 'Engineer', country: 'USA', salary: 80000 },
      { fullName: 'Test Employee 2', jobTitle: 'Designer', country: 'India', salary: 50000 },
      { fullName: 'Another Person', jobTitle: 'Engineer', country: 'India', salary: 60000 },
    ],
  });
});

afterAll(async () => {
  await prisma.employee.deleteMany();
  await prisma.$disconnect();
});

describe('GET /api/employees', () => {
  it('should return paginated employees', async () => {
    const res = await request(app).get('/api/employees');
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.pagination).toBeDefined();
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('should filter by country', async () => {
    const res = await request(app).get('/api/employees?country=India');
    expect(res.status).toBe(200);
    expect(res.body.data.every((e: any) => e.country === 'India')).toBe(true);
  });

  it('should search by name', async () => {
    const res = await request(app).get('/api/employees?search=Test');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  it('should paginate correctly', async () => {
    const res = await request(app).get('/api/employees?page=1&limit=2');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(2);
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.limit).toBe(2);
  });

  it('should sort by salary ascending', async () => {
    const res = await request(app).get('/api/employees?sortBy=salary&sortOrder=asc');
    expect(res.status).toBe(200);
    const salaries = res.body.data.map((e: any) => e.salary);
    for (let i = 1; i < salaries.length; i++) {
      expect(salaries[i]).toBeGreaterThanOrEqual(salaries[i - 1]);
    }
  });
});

describe('GET /api/employees/:id', () => {
  it('should return employee by id', async () => {
    const employees = await request(app).get('/api/employees?limit=1');
    const id = employees.body.data[0].id;
    const res = await request(app).get(`/api/employees/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(id);
  });

  it('should return 404 for non-existent id', async () => {
    const res = await request(app).get('/api/employees/99999');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/employees', () => {
  it('should create a new employee', async () => {
    const res = await request(app)
      .post('/api/employees')
      .send({ fullName: 'New Employee', jobTitle: 'Manager', country: 'Canada', salary: 100000 });
    expect(res.status).toBe(201);
    expect(res.body.fullName).toBe('New Employee');
  });

  it('should reject invalid data', async () => {
    const res = await request(app).post('/api/employees').send({ fullName: 'A' });
    expect(res.status).toBe(400);
  });

  it('should reject negative salary', async () => {
    const res = await request(app)
      .post('/api/employees')
      .send({ fullName: 'Bad Employee', jobTitle: 'Manager', country: 'USA', salary: -1000 });
    expect(res.status).toBe(400);
  });
});

describe('PUT /api/employees/:id', () => {
  it('should update an existing employee', async () => {
    const employees = await request(app).get('/api/employees?limit=1');
    const id = employees.body.data[0].id;
    const res = await request(app).put(`/api/employees/${id}`).send({ salary: 95000 });
    expect(res.status).toBe(200);
    expect(res.body.salary).toBe(95000);
  });

  it('should return 404 for non-existent id', async () => {
    const res = await request(app).put('/api/employees/99999').send({ salary: 50000 });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/employees/:id', () => {
  it('should delete an existing employee', async () => {
    const newEmp = await request(app)
      .post('/api/employees')
      .send({ fullName: 'Delete Me', jobTitle: 'Temp', country: 'USA', salary: 50000 });
    const id = newEmp.body.id;
    const res = await request(app).delete(`/api/employees/${id}`);
    expect(res.status).toBe(204);
    const getRes = await request(app).get(`/api/employees/${id}`);
    expect(getRes.status).toBe(404);
  });

  it('should return 404 for non-existent id', async () => {
    const res = await request(app).delete('/api/employees/99999');
    expect(res.status).toBe(404);
  });
});

describe('GET /api/employees/countries', () => {
  it('should return distinct countries', async () => {
    const res = await request(app).get('/api/employees/countries');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toContain('USA');
    expect(res.body).toContain('India');
  });
});

describe('GET /api/employees/job-titles', () => {
  it('should return distinct job titles', async () => {
    const res = await request(app).get('/api/employees/job-titles');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toContain('Engineer');
    expect(res.body).toContain('Designer');
  });
});