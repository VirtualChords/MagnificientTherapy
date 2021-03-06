const mongoose = require('mongoose');
const { gallery } = require('./gallery');

const updatesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    pictures: {
        type: [gallery]
    },
    time: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('updates', updatesSchema);