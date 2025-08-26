const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    empId: String,
    date: Date,
    reason: String,
    grant: { type: String, default: 'Pending' }
});

module.exports = mongoose.model('Leave', leaveSchema);
