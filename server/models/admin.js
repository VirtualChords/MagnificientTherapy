const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const admin = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    age: {
        type: Number,
    },
    picture: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }

});

admin.pre('save', function(next) {
    let user = this;
    bcryptjs.genSalt(10, function (err, salt) {
        bcryptjs.hash(user.password, salt, function (err, hash) {
            if (err) {
                next(err)
            } else {
                user.password = hash;
                next()
            }
        });
        next(err);
    });
});

admin.methods.comparePassword = function(password) {
    let user = this;
    return bcryptjs.compareSync(password, user.password);
};


module.exports = mongoose.model('admin', admin)