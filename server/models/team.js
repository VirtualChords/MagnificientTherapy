const mongoose = require('mongoose');

const team = new mongoose.Schema({
    name: String,
    post: String,
    picture: String
});

module.exports = mongoose.model('team', team);