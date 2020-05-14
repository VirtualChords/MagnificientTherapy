const msg = require('../../models/message');
const mongoose = require('mongoose');
const admin = require('../../models/admin');

const getAdmin = (req, res, callback) => {
    if(req.payload && req.payload.email){
        admin
        .findOne({ email: req.payload.email})
        .exec((err, user)=>{
            if(err){
                res.status(404).json({success: false, message: 'could not authenticate user'});
            } else {
                if(!user){
                    res.status(404).json({success: false, message: 'User does not exist! Pls login again'});
                } else {
                    callback(req, res, user)
                }
            }
        })
    } else {
        res.status(404).json({success: false, message: 'Could not authenticate user'});
    };
};

// this is to get just one message
const getMessages = (req, res) => {
    if (req.params.messageid || req.params.messageid != null) {
        msg
            .findById(req.messageid, (err, data) => {
                if (err) {
                    return res
                        .status(404)
                        .json({ success: false, message: 'An error occured... \n' + err });
                } else {
                    if (!data) {
                        return res
                            .status(404)
                            .json({ success: false, message: 'Sorry, message does not exist.' });
                    } else {
                        res
                            .status(200)
                            .json({ success: true, data });
                    }
                }
            });

        // this is to get all messages
    } else {
        msg
            .find((err, data) => {
                if (err) {
                     return res
                        .status(404)
                        .json({ success: false, message: 'An error occured... \n' + err });
                } else {
                    if (!data) {
                        return res
                            .status(404)
                            .json({ success: false, success: 'No messages yet.' });
                    } else {
                        res
                            .status(200)
                            .json({ success: true, data });
                    }
                }
            });
    };
};

// this is to post a message from the admin user
const postMessage = (req, res) => {
    let compose = {
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message,
        picture: req.body.picture
    };
    if (!req.body) {
        return res
            .status(404)
            .json({ success: false, message: 'Pls provide content' });
    } else {
        msg
            .create(compose, (err, res) => {
                if (err) {
                    return res
                        .status(400)
                        .json({ success: false, message: 'Some error occured... \n' + err });
                } else {
                    res
                        .status(201)
                        .json({ success: true, message: 'Message sent!' });
                }
            });
    };
};

// Delete a message
// const deleteMessage = (req, res) => {
//     if(!req.params.messageid){
//         return res
//         .status(404)
//         .json({ success: false, message: 'Pls provide a message to be deleted.'});
//     } else {
//         msg
//         .findByIdAndDelete(req.params.messageid, (err, res)=>{
//             if(err){
//                 return res
//                 .status(400)
//                 .json({ success: false, message: 'Message not found...'});
//             } else {
//                 return res
//                 .status(204)
//                 .json({ success: true, message: 'Message has been successfully deleted.'})
//             }
//         })
//     }
// }


module.exports = {
    postMessage,
    getMessages
}