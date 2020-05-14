const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const admin = require('../models/admin');
const db = require('../connections/db');
const jet = require('express-jwt');
const auth = jet({
    secret: process.env.secret,
    userProperty: 'payload',
    getToken: function (req) {
        if (req.headers["x-access-token"]) {
          return req.headers["x-access-token"];
        }
        return null;
      }
});

// register route for signing up the admin user
router.post('/register', (req, res) => {
    let Admin = new admin({
        name: req.body.name,
        address: req.body.address,
        age: req.body.age,
        picture: req.body.picture,
        phone: req.body.phone,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    if (
        req.body.name == null || req.body.name == '' ||
        req.body.address == null || req.body.address == '' ||
        req.body.age == null || req.body.age == '' ||
        req.body.picture == null || req.body.picture == '' ||
        req.body.phone == null || req.body.phone == '' ||
        req.body.email == null || req.body.email == '' ||
        req.body.username == null || req.body.username == '' ||
        req.body.password == null || req.body.password == ''
    ) {
        res
            .status(401)
            .json({ success: false, message: 'All fields are required... Pls fill all fields' })
    } else {
        Admin.save((err) => {
            if (err) {
                res
                    .status(404)
                    .json(err)
            } else {
                res
                    .status(201)
                    .json({ success: true, message: 'Admin User saved' })
            }
        })
    }


});

// Login route for admin user
router.post('/login', (req, res) => {
    if (req.body.email == null || req.body.email == '' || req.body.password == null || req.body.password == '') {
        res
            .status(401)
            .json({ success: false, message: 'All fields are required.' })
    } else {
        admin
            .findOne({ email: req.body.email })
            .select('email password name username picture address phone _id')
            .exec((err, user) => {
                if (err) {
                    return res
                        .status(404)
                        .json({ success: false, message: 'Some error occured ' + err })
                } else {
                    if (!user) {
                        return res
                            .status(401)
                            .json({ success: false, message: 'User not found' });
                    } else {
                        const validPassword = user.comparePassword(req.body.password)
                        if (!validPassword) {
                            return res
                                .status(401)
                                .json({ success: false, message: 'Incorrect password... Pls check and try again' });
                        } else {
                            const token = jwt.sign(
                                {
                                    _id: user._id,
                                    username: user.username,
                                    name: user.name,
                                    email: user.email,
                                    picture: user.picture,
                                    address: user.address,
                                    phone: user.phone
                                },
                                process.env.secret,
                                { expiresIn: "10h" });
                                // console.log(user)
                            res
                                .status(201)
                                .json({ success: true, message: 'Successfully signed in', token: token })
                        }
                    }
                }
            });
    }
});


const getAdmin = (req, res, callback) => {
    if (req.payload && req.payload.email) {
        admin
            .findOne({ email: req.payload.email })
            .exec((err, user) => {
                if (err) {
                    res.status(404).json({ success: false, message: 'could not authenticate user' });
                } else {
                    if (!user) {
                        res.status(404).json({ success: false, message: 'User does not exist! Pls login again' });
                    } else {
                        callback(req, res, user)
                    }
                }
            })
    } else {
        res.status(404).json({ success: false, message: 'Could not authenticate user' });
    };
};

router.post('/me', auth, (req, res) => {
    // console.log(req.payload)
    res.json(req.payload)
    // getAdmin(req, res, (req, res, user) => {
    //     res.send(user);
    // });
});

module.exports = router;