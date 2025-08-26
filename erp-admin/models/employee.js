const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    empId: { type: String, unique: true },
    name: String,
    email: String,
    password: String,
    salary: Number
});

module.exports = mongoose.model('Employee', employeeSchema);
