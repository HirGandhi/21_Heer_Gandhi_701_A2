const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const employeeRoutes = require('./routes/employee');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // use EJS templates

mongoose.connect('mongodb://127.0.0.1:27017/erp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use('/employee', employeeRoutes);

app.listen(3001, () => console.log('Employee server running on http://localhost:3001'));


// EmpID: EMP1755951625013
// Password: l72u4448