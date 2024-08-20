const { PrismaClient } = require('@prisma/client');


const mockPrismaClients = {
    user: {
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    }
}

module.exports = {
    PrismaClient: jest.fn(() => mockPrismaClients)
}