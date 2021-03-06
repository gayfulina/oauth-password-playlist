const express = require('express');
const app = express();
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');

const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');


// set up view engine
app.set('view engine', 'ejs');

app.use(cookieSession({
    maxAge: 24*60*60*1000,
    keys: [keys.session.cookieKey],
}))

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//connect to mongodb
mongoose.connect(keys.mongodb.dbURI,  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,   })
    .then(() => console.log("Database connected!"))
    .catch(err => console.log(err));

// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// create home route
app.get('/', (req, res) => {
    res.render('home', {user: req.user});
});

app.listen(3000, () => {
    console.log('app now listening for request on port 3000');
})
