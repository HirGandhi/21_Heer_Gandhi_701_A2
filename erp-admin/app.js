const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/admin');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/erp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret123',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/erp' })
}));

app.use('/admin', adminRoutes);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
