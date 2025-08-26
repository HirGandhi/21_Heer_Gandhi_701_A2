const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');
const Leave = require('../models/leave');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Login page
router.get('/login', (req, res) => {
    res.render('employee/login', { error: null });
});

router.post('/login', async (req, res) => {
    const { empId, password } = req.body;
    const emp = await Employee.findOne({ empId });
    if(!emp) return res.render('employee/login', { error: 'Invalid EmpID' });

    const match = await bcrypt.compare(password, emp.password);
    if(!match) return res.render('employee/login', { error: 'Invalid password' });

    // Create JWT
    const token = jwt.sign({ empId: emp.empId }, 'secretkey', { expiresIn: '1h' });
    res.redirect(`/employee/profile?token=${token}`);
});

// Middleware to verify JWT from query
function verifyToken(req, res, next){
    const token = req.query.token;
    if(!token) return res.send('Access denied');

    jwt.verify(token, 'secretkey', (err, decoded) => {
        if(err) return res.send('Invalid token');
        req.empId = decoded.empId;
        next();
    });
}

// Profile page
// router.get('/profile', verifyToken, async (req, res) => {
//     const emp = await Employee.findOne({ empId: req.empId });
//     res.render('employee/profile', { emp });
// });
router.get('/profile', verifyToken, async (req, res) => {
    const emp = await Employee.findOne({ empId: req.empId });
    // pass token to the template
    res.render('employee/profile', { emp, token: req.query.token });
});


// Apply Leave form
router.get('/apply-leave', verifyToken, (req, res) => {
    res.render('employee/applyLeave');
});

router.post('/leave', verifyToken, async (req, res) => {
    const { date, reason } = req.body;
    const leave = new Leave({ empId: req.empId, date, reason });
    await leave.save();
    res.redirect(`/employee/leaves?token=${req.query.token}`);
});

// List leaves
router.get('/leaves', verifyToken, async (req, res) => {
    const leaves = await Leave.find({ empId: req.empId });
    res.render('employee/leaveList', { leaves });
});

module.exports = router;
