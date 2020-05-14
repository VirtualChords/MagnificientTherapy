const tm = require('../../models/team');
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

const postMember = (req, res) => {
    const men = {
        name: req.body.name,
        post: req.body.post,
        picture: req.body.picture
    }

    if (!req.body) {
        return res
            .status(400)
            .json({ success: false, message: 'No request body provided' });
    } else {
        tm
            .create(men, (err, res) => {
                if (err) {
                    return res
                        .status(400)
                        .json({ success: false, message: 'An error occured while trying to process the request' });
                } else {
                    res
                        .status(201)
                        .json({ success: true, message: 'Team members have been created' });
                }
            });
    };
};

const getMember = (req, res) => {
    if(req.params.teamMember){
        tm
        .findById(req.params.teamMember, (err, member) => {
            if(err){
                return res
                .status(404)
                .json({ success: false, message: 'An error occured while finding member, pls check and try again... \n' + err});
            } else {
                if(!member){
                    return res
                    .status(404)
                    .json({ success: false, message: 'Not a member on the data base'});
                } else {
                    res
                    .status(200)
                    .json({ success: true, member});
                };
            };
        });
    } else {
        tm
        .find((err, members) => {
            if(err){
                return res
                .status(400)
                .json({ success: false, message: 'Some error occured here, this shouldn\'t be happening... \n' + err});
            } else {
                if(!members) {
                    return res
                    .status(400)
                    .json({ success: false, message: 'No members were found'});
                } else {
                    res
                    .status(200)
                    .json({ success: true, members});
                }
            };
        });
    };
};

const updateMember = (req, res) => {
    if(!req.params.teamMember){
        return res
        .status(404)
        .json({ success: false, message: 'Pls provide the member to be updated' });
    } else {
        let upmember = {
            name: req.body.name,
            picture: req.body.picture,
            post: req.body.post
        }

        tm
        .findByIdAndUpdate(req.params.teamMember, upmember, (err, res) => {
            if(err){
                return res
                .status(404)
                .json({ success: false, message: 'Error trying to update member details...' });
            } else {
                res
                .status(200)
                .json({ success: true, message: 'Member has been successfully updated' });
            }
        });
    };
};

const deleteMember = (req, res) => {
    if(!req.params.teamMember){
        return res
        .status(404)
        .json({ success: false, message: 'Pls provide a member to be deleted' });
    } else {
        tm
        .findByIdAndDelete(req.params.teamMember, (err, res)=>{
            if(err) {
                return res
                .status(400)
                .json({ success: false, message: 'Unable to delete member, for some reasons' });
            } else {
                return res
                .status(204)
                .json({ success: true, message: 'Successfully deleted team member.' });
            };
        });
    };
};

module.exports = {
    postMember,
    getMember,
    updateMember,
    deleteMember
};