const express = require('express')
const { PrismaClient } = require('@prisma/client');
const { userSchema } = require('./schemas/users')


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

    console.log("validation", validation)

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const newUser = await prisma.user.create({
            data: {
                ...value
            }
        });

        const {password, ...rest} = newUser

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


// app.put('/users/:userID', updateUser);
// app.patch('/users/:userID', updateUser);
// function updateUser(req, res) {
//     const { userID } = req.params;
//     const userIndex = db.users.findIndex(u => `${u.id}` === userID);
//     if (userIndex !== -1) {
//         // update user except id
//         db.users[userIndex] = {
//             ...db.users[userIndex],
//             ...req.body,
//             id: db.users[userIndex].id
//         };
//         fs.writeFileSync(DB_PATH, JSON.stringify(db));
//         res.json(db.users[userIndex]);
//     } else {
//         res.status(404).json({ error: 'User not found' });
//     }
// }
// app.delete('/users/:userID', function (req, res) {
//     const { userID } = req.params;
//     const userIndex = db.users.findIndex(u => `${u.id}` === userID);

//     if (userIndex !== -1) {
//         const deletedUser = db.users.splice(userIndex, 1);
//         fs.writeFileSync(DB_PATH, JSON.stringify(db));
//         res.json({ message: 'User deleted successfully', user: deletedUser });
//     } else {
//         res.status(404).json({ message: 'User not found' });
//     }
// });



// run server
app.listen(PORT, () => {
    console.log(`express runs at port ${PORT}`)
})