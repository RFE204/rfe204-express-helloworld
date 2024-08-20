const express = require('express')
const { PrismaClient } = require('@prisma/client');
const passport = require("passport");
const 
JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;

const jwt = require('jsonwebtoken');
const { userSchema, userPartialSchema } = require('./schemas/users')
const { validPassword, genPassword } = require('./helpers');


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret',
    issuer: 'accounts.examplesoft.com',
    audience: 'yoursite.net'
}

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    prisma.user.findUnique({
        where: {
            id: jwt_payload.sub
        }
    })
    .then(user => {
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    })
    .catch(err => {
        return done(err, false);
    });
}));

//  create 
const PORT = process.env.PORT || 3000
const app = express()
const prisma = new PrismaClient()


// middleewares
app.use(
    express.json()
)
app.use(passport.initialize());


// routes
app.post('/register', async function (req, res) {
    const { email, name, password } = req.body;
    // encrypt password
    const { salt, hash } = genPassword(password);


    try {
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: `${hash}.divider.${salt}`
            }
        });

        const { password: _, ...safeUser } = user;

        res.json(safeUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/login', async function (req, res) {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (user) {
            const [hash, salt] = user.password.split('.divider.');
            if (validPassword(password, hash, salt)) {
                // generate token
                const token = jwt.sign
                (
                    { sub: user.id, email: user.email },
                    'secret',
                    { expiresIn: '1h' }
                );
                res.json({ token, expiresIn: 3600 });
                res.json({ message: 'Login successful' });
            } else {
                res.status(401).json({ error: 'Invalid email or password' });
            }
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/users',  passport.authenticate(
    'bearer', { session: false, }
),async (req, res) => {
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


module.exports = app; // Export the app for testing

// // run server
// app.listen(PORT, () => {
//     console.log(`express runs at port ${PORT}`)
// })