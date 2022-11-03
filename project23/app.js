const path = require('path');
const express = require('express');
const Todo = require('./models/todo');

const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const bodyParser = require('body-parser');

const User = require('./models/user');

const csrf = require ('csurf');

const MONGO_URI = 'mongodb+srv://oriola23:oriola@cluster0.j71oyfi.mongodb.net/?retryWrites=true';

const app = express();
const store = new MongoDBStore({
    uri: MONGO_URI
})

const csrfProtection = csrf();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }));
app.use(flash());

app.use (csrfProtection);

app.set('view engine', 'ejs');

app.use((req, res , next ) => {
    res.locals.isAuthentucated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken ();
    next();
});

app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
      .then(user => {
        if(!user) {
          return next()
        }
        req.user = user;
        next();
      })
      .catch(err => {
        throw new Error (err);
      });
  });


app.use('/', indexRoutes);
app.use(authRoutes);

mongoose.connect(MONGO_URI)
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err)
    });

