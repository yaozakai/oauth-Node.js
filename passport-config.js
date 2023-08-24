const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserbyEmail, getUserbyId) {
    const authenticateUser = async (email, password, done) => {
        const user = getUserbyEmail(email)
        if (user == null) {
            return done(null, false, { message: 'No user exists'})
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done( null, user)
            } else {
                return done( null, false, { message: 'Incorrect password'})
            }
        } catch (e) {
            return done(e)
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'email',    // define the parameter in req.body that passport can use as username and password
    passwordField: 'password'}, authenticateUser))

    passport.serializeUser((user, done) => { done(null, user.id) })
    passport.deserializeUser((id, done) => { return done(null, getUserbyId(id)) })
}

module.exports = initialize