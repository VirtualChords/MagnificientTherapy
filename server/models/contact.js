const mongoose = require('mongoose');

const contact = new mongoose.Schema({
    accountName: String,
    accountNo: Number,
    address: {
        street: String,
        area: String,
        lga: String,
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true,
            default: 'Nigeria'
        }
    },
    phone: [String],
    email: [String]
});

module.exports = mongoose.model('contact', contact);