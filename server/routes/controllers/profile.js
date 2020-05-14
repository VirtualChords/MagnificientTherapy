const mongoose = require('mongoose');
const admin = require('../../models/admin');
const jwt = require('jsonwebtoken')

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

const updateProfile = (req, res) => {
    getAdmin(req, res, (req, res, user) => {
        if (req.body || req.body.username != null || req.body.username != '' || req.body.name != null || req.body.name != '' || req.body.email != null || req.body.email != '' || req.body.phone != null || req.body.phone != '' || req.body.address != null || req.body.address != '') {
            let updateData = {
                picture: req.body.picture,
                username: req.body.username,
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address
            }
            
            admin.findOne({email: user.email}, (err, person) => {
                if(err) {
                    res.json({
                        success: false,
                        message: 'Could not match any document'
                    });
                } else {
                    person.updateOne(updateData, (err, data) => {
                        if (err){
                            res.json({success: false, message: 'Unable to update item'})
                        } else {
                            const token = jwt.sign(updateData, process.env.secret,
                                { expiresIn: "10h" });
                            res.json({success: true, data, token})
                        }
                    })
                }
            })
        }
    });
};

const createProfile = (req, res) => {
    getAdmin(req, res, (req, res, user) => {
        if (req.body || req.body.username != null || req.body.username != '' || req.body.name != null || req.body.name != '' || req.body.phone != null || req.body.phone != '' || req.body.address != null || req.body.address != '') {
            let updateData = {
                username: req.body.username,
                name: req.body.name,
                phone: req.body.phone,
                address: req.body.address
            }
            
            admin.findOneAndUpdate({email: user.email}, updateData, (err, data) => {
                if(err) {
                    res.json({
                        success: false,
                        message: 'Could not update, no match found'
                    });
                } else {
                    res.json({ success: true, data})
                }
            })
        }
    });
};



module.exports = {
    updateProfile,
    createProfile
}