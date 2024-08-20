const express = require('express')
const { PrismaClient } = require('@prisma/client');
const { userSchema, userPartialSchema } = require('./schemas/users')


//  create 
const PORT = process.env.PORT || 3000
const app = express()
const prisma = new PrismaClient()


// middleewares
app.use(
    express.json()
)

// routes
app.get('/users', async (req, res) => {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;

    const offset = (pageNumber - 1) * pageSize;
    const [users, total] = await Promise.all([
        prisma.user.findMany({
            skip: offset,
            take: pageSize,
        }),
        prisma.user.count(),
    ]);

    res.json({
        total,
        page: pageNumber,
        limit: pageSize,
        data: users,
    });
});

app.post('/users', async function (req, res) {
    const validation = userSchema.validate(req.body)
    const { error, value } = validation

    // console.log("validation", validation)

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const newUser = await prisma.user.create({
            data: {
                ...value
            }
        });

        const { password, ...rest } = newUser

        res.status(201).json(rest)

    } catch (error) {
        res.status(500).json({ error: String(error) })
    }
})
app.get('/users/:userID', async function (req, res) {
    const { userID } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(userID, 10)
            }
        });

        if (user) {
            const { password, ...safeUser } = user;
            res.json(safeUser);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.put('/users/:userID', updateUser);
app.patch('/users/:userID', updateUser);
async function updateUser(req, res) {
    const { userID } = req.params;
    const schemaValidator = req.method.toLowerCase() === "put" ? userSchema : userPartialSchema

    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(userID, 10)
        }
    });
    if (user) {
        const { error, value } = schemaValidator.validate(req.body)

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }


        try {

            const updatedUser = await prisma.user.update({
                where: {
                    id: parseInt(userID, 10)
                },
                data: value
            });

            const { password, ...safeUser } = updatedUser;
            res.json(safeUser);
        } catch (error) {
            res.status(400).json({ error: String(error) });
        }

    } else {
        res.status(404).json({ error: 'User not found' });
    }
}


app.delete('/users/:userID', async (req, res) => {
    const { userID } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(userID, 10)
            }
        });

        if (user) {
            await prisma.user.delete({
                where: {
                    id: parseInt(userID, 10)
                }
            });
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




module.exports = app