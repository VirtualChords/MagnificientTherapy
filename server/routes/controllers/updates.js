const updates = require('../../models/updates');
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


// Post picture to the updates

const postUpdate = (req, res) => {
    if (!req.body) {
        return res
            .status(400)
            .json({ success: false, message: 'Pls fill the necessary fields' });
    }

    let uppdate = ({
        picture: req.body.picture,
        title: req.body.title,
        time: req.body.time,
        content: req.body.content
    });

    updates
        .create(uppdate, (err, res) => {
            if (err) {
                return res
                    .status(400)
                    .json({ success: true, message: err });
            } else {
                return res
                    .status(201)
                    .json({ success: true, message: 'Update updated' });
            }
        });
};



// get pictures from updates

const getUpdates = (req, res) => {
    // get individual update
    if (req.params.updateid) {
        updates
            .findById(req.params.updateid, (err, update) => {
                if (err) {
                    return res
                        .status(404)
                        .json({ success: false, message: 'Some error occured while getting update... ' + err });
                } else {
                    if (!update) {
                        return res
                            .status(404)
                            .json({ success: false, message: 'Update not found, pls check and try again' });
                    } else {
                        return res
                            .status(200)
                            .json({ success: true, update });
                    }
                }
            });
    } else {
        // get all updates
        updates
            .find((err, updates) => {
                if (err) {
                    return res
                        .status(404)
                        .json({ success: false, message: 'Some error occured while getting updates... ' + err });
                } else {
                    if (!updates) {
                        return res
                            .status(404)
                            .json({ success: false, message: 'No updates were found in the updates.' });
                    } else {
                        return res
                            .status(200)
                            .json({ success: true, updates });
                    }
                }
            });
    }
};


// Modify update in the updates

const updateUpdate = (req, res) => {
    // find the update
    if (req.params.updateid) {
        updates
            .findById(req.params.updateid)
            .select('')
            .exec((err, update) => {
                if (err) {
                    return res
                        .status(404)
                        .json({ success: false, message: 'Some unknown error occured. ' + err })
                } else {
                    if (!update) {
                        return res
                            .status(404)
                            .json({ success: false, message: 'Update not found, pls check and try again' });
                    }

                    // variable of the body
                    const lift = ({
                        picture: req.body.picture,
                        title: req.body.title,
                        time: req.body.time,
                        content: req.body.content
                    })

                    // update the item
                    updates
                        .updateOne({ _id: update._id }, lift, (err, res) => {
                            if (err) {
                                return res
                                    .status(400)
                                    .json({ success: false, message: 'Error occured while updating update details. ' + err });
                            } else {
                                res
                                    .status(200)
                                    .json({ success: true, message: 'Successfully updated update details.' })
                            }
                        });
                }
            });

    } else {
        return res
            .status(404)
            .json({ success: false, message: 'Bad request. Pls provide valid update' });
    }
};


// Delete a update from the updates
const deleteUpdate = (req, res) => {
    if (req.params.updateid) {
        updates
            .findByIdAndDelete(req.params.updateid, (err, res) => {
                if (err) {
                    return res
                        .status(400)
                        .json({ success: false, message: 'Error deleting update. ' + err });
                } else {
                    return res
                        .status(204)
                        .json({ success: true, message: 'Successfully deleted update' });
                }
            });
    } else {
        return res
            .status(404)
            .json({ success: true, message: 'Pls provide an update to be deleted' });
    }
};

// export all controllers for use outside file

module.exports = {
    postUpdate,
    updateUpdate,
    getUpdates,
    deleteUpdate
};