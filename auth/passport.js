const { Strategy, ExtractJwt } = require('passport-jwt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret',
}

module.exports = function (passport) {
    var opts = {};
    opts.secretOrKey = jwtOptions.secret;
    passport.use(new Strategy(jwtOptions, function (jwt_payload, done) {
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
};