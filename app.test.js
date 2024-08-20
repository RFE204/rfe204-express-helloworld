
const request = require('supertest')
const { PrismaClient } = require('@prisma/client');


jest.mock('@prisma/client', () => require('./__mock__/prisma'))
const prisma = new PrismaClient()

const app = require('./app')

describe('test express app', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });


    test('GET /users', async () => {

        prisma.user.count.mockResolvedValue(1)
        prisma.user.findMany.mockResolvedValue({
            total: 1,
            page: 1,
            limit: 10,
            data: [
                { id: 1, email: "hello@world.com", name: "John Doe" }
            ]
        })

        const response = await request(app).get('/users')

        expect(response.statusCode).toBe(200)
        expect(response.body.data.total).toBe(1)
        expect(response.body.data.data).toHaveLength(1)
    })
    test('GET /users/:userID', async () => {
        prisma.user.findUnique.mockResolvedValue({
            id: 1,
            email: "hello@world.com",
            name: "John Doe"

        })

        const response = await request(app).get('/users/1')

        expect(response.statusCode).toBe(200)
        expect(response.body.email).toBe("hello@world.com")


    })

    test('POST /users', async () => {
        prisma.user.create.mockResolvedValue({ id: 1, email: "hello@world.com", name: "John Doe" })

        const response = await request(app).post('/users').send({
            email: "hello@world.com",
            name: "John Doe",
            password: "1233412121",
        })

        expect(response.statusCode).toBe(201)
        expect(response.body.email).toBe("hello@world.com")


    })
    test('PUT /users/:userID', async () => {
        prisma.user.findUnique.mockResolvedValue({
            id: 1,
            email: "hello@world.com",
            name: "John Doe"

        })
        prisma.user.update.mockResolvedValue({
            id: 1,
            email: "update@world.com",
            name: "Update Doe"

        })

        const response = await request(app).put('/users/1')
        .send({
            email: "update@world.com",
            name: "Update Doe",
            password: "123455678787",
        })

        expect(response.statusCode).toBe(200)
        expect(response.body.email).toBe("update@world.com")
        
        

    })
    test('PATCH /users/:userID', async () => {
        prisma.user.findUnique.mockResolvedValue({
            id: 1,
            email: "hello@world.com",
            name: "John Doe"

        })
        prisma.user.update.mockResolvedValue({
            id: 1,
            email: "update@world.com",
            name: "Update Doe"

        })

        const response = await request(app).patch('/users/1')
        .send({
            email: "update@world.com",
        })

        expect(response.statusCode).toBe(200)
        expect(response.body.email).toBe("update@world.com")
        
        
    })
    test('DELETE /users/:userID', async () => {
        prisma.user.findUnique.mockResolvedValue({
            id: 1,
            email: "hello@world.com",
            name: "John Doe"

        })
        prisma.user.delete.mockResolvedValue({
            id: 1,
            email: "update@world.com",
            name: "Update Doe"

        })

        const response = await request(app).delete('/users/1')

        expect(response.statusCode).toBe(200)
        expect(response.body.message).toBe('User deleted successfully')
        
    })

})