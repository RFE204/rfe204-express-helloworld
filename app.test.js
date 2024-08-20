const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const app = require('./app'); // Adjust the path according to your project structure

// Mock Prisma client
jest.mock('@prisma/client', () => require('./__mocks__/prismaClient'));
const prisma = new PrismaClient();

describe('User API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET /users - should return a list of users', async () => {
        prisma.user.findMany.mockResolvedValue([
            { id: 1, email: 'test@example.com', name: 'Test User' }
        ]);
        prisma.user.count.mockResolvedValue(1);

        const response = await request(app).get('/users').query({ page: 1, limit: 10 });

        expect(response.statusCode).toBe(200);
        expect(response.body.total).toBe(1);
        expect(response.body.data).toHaveLength(1);
    });

    test('POST /users - should create a new user', async () => {
        prisma.user.findUnique.mockResolvedValue(null);
        prisma.user.create.mockResolvedValue({
            id: 1,
            email: 'test@example.com',
            name: 'Test User'
        });

        const response = await request(app)
            .post('/users')
            .send({
                email: 'test@example.com',
                name: 'Test User',
                password: 'password123'
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.email).toBe('test@example.com');
    });

    test('GET /users/:userID - should return a user by ID', async () => {
        prisma.user.findUnique.mockResolvedValue({
            id: 1,
            email: 'test@example.com',
            name: 'Test User'
        });

        const response = await request(app).get('/users/1');

        expect(response.statusCode).toBe(200);
        expect(response.body.email).toBe('test@example.com');
    });

    test('PUT /users/:userID - should update a user', async () => {
        prisma.user.findUnique.mockResolvedValue({
            id: 1,
            email: 'test@example.com',
            name: 'Test User'
        });

        prisma.user.update.mockResolvedValue({
            id: 1,
            email: 'updated@example.com',
            name: 'Updated User'
        });

        const response = await request(app)
            .put('/users/1')
            .send({
                email: 'updated@example.com',
                password: 'admin1234',
                name: 'Updated User'
            });


        expect(response.statusCode).toBe(200);
        expect(response.body.email).toBe('updated@example.com');
    });
    
    test('PATCH /users/:userID - should partially update a user', async () => {
        prisma.user.findUnique.mockResolvedValue({
            id: 1,
            email: 'test@example.com',
            name: 'Test User'
        });

        prisma.user.update.mockResolvedValue({
            id: 1,
            email: 'updated@example.com',
            name: 'Updated User'
        });

        const response = await request(app)
            .patch('/users/1')
            .send({
                email: 'updated@example.com',
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.email).toBe('updated@example.com');
    });

    test('DELETE /users/:userID - should delete a user', async () => {
        prisma.user.findUnique.mockResolvedValue({
            id: 1,
            email: 'test@example.com',
            name: 'Test User'
        });

        prisma.user.delete.mockResolvedValue({});

        const response = await request(app).delete('/users/1');

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('User deleted successfully');
    });
});