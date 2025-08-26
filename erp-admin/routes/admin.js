const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');
const bcrypt = require('bcrypt');
// const nodemailer = require('nodemailer'); // optional for now

// Admin login page
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if(username === 'admin' && password === 'admin123'){
        req.session.admin = true;
        res.redirect('/admin/dashboard');
    } else {
        res.render('login', { error: 'Invalid credentials' });
    }
});

// Dashboard
router.get('/dashboard', (req, res) => {
    if(!req.session.admin) return res.redirect('/admin/login');
    res.render('dashboard');
});

// Add Employee Form
router.get('/add-employee', (req, res) => {
    if(!req.session.admin) return res.redirect('/admin/login');
    res.render('addEmployee', { error: null, empInfo: null });
});

router.post('/add-employee', async (req, res) => {
    try {
        let { name, email, salary } = req.body;
        let empId = 'EMP' + Date.now();
        let password = Math.random().toString(36).slice(-8); // random password
        let hashedPassword = await bcrypt.hash(password, 10);

        const emp = new Employee({ empId, name, email, salary, password: hashedPassword });
        await emp.save();

        // Optionally send email (you can comment this if testing)
        /*
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: 'youremail@gmail.com', pass: 'yourpassword' }
        });
        await transporter.sendMail({
            from: 'youremail@gmail.com',
            to: email,
            subject: 'Your Employee Account',
            text: `Your EmpID: ${empId} \nPassword: ${password}`
        });
        */

        // Show EmpID and Password directly on page
        res.render('addEmployee', { 
            error: null, 
            empInfo: { empId: empId, password: password, name: name } 
        });
    } catch (err) {
        console.error(err);
        res.render('addEmployee', { error: 'Error adding employee', empInfo: null });
    }
});

// List Employees
router.get('/list-employees', async (req, res) => {
    if(!req.session.admin) return res.redirect('/admin/login');
    let employees = await Employee.find();
    res.render('listEmployees', { employees });
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

module.exports = router;
