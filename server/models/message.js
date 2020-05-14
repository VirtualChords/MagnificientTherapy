const mongoose = require('mongoose');

const messages = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    picture: String,
    subject: {
        type: String
    },
    message: {
        type: String
    },
    read: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('messages', messages);