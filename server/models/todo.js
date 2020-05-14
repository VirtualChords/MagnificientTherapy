const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todo = new Schema({
    done: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    createdBy: {
        type: String
    },
    due: {
        type: Date
    }
});

module.exports = mongoose.model('todo', todo);