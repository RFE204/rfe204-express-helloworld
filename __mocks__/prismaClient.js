// __mocks__/prismaClient.js
const { PrismaClient } = require('@prisma/client');

const mockPrisma = {
    user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
    },
};

module.exports = {
    PrismaClient: jest.fn(() => mockPrisma),
};