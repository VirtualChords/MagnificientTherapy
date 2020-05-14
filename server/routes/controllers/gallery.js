const gallery = require('../../models/gallery');
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



// Post picture to the gallery

const postPic = (req, res) => {
    if (!req.body) {
        return res
            .status(400)
            .json({ success: false, message: 'Pls fill the necessary fields' });
    }

    let picture = ({
        name: req.body.name,
        title: req.body.title,
        time: req.body.time,
        content: req.body.content
    });

    gallery
        .create(picture, (err, res) => {
            if (err) {
                return res
                    .status(400)
                    .json({ success: true, message: err });
            } else {
                return res
                    .status(201)
                    .json({ success: true, message: 'Picture(s) updated' });
            }
        });
};



// get pictures from gallery

const getPics = (req, res) => {
    if (req.params.photoid) {
        gallery
            .findById(req.params.photoid, (err, photo) => {
                if (err) {
                    return res
                        .status(404)
                        .json({ success: false, message: 'Some error occured while getting photo... ' + err });
                } else {
                    if (!photo) {
                        return res
                            .status(404)
                            .json({ success: false, message: 'Picture not found, pls check and try again' });
                    } else {
                        return res
                            .status(200)
                            .json({ success: true, photo });
                    }
                }
            });
    } else {
        gallery
            .find((err, photos) => {
                if (err) {
                    return res
                        .status(404)
                        .json({ success: false, message: 'Some error occured while getting photos... ' + err });
                } else {
                    if (!photos) {
                        return res
                            .status(404)
                            .json({ success: false, message: 'No photos were found in the gallery.' });
                    } else {
                        return res
                            .status(200)
                            .json({ success: true, photos });
                    }
                }
            });
    }
};


// Update photo in the gallery

const updatePic = (req, res) => {
    if (req.params.photoid) {
        gallery
            .findById(req.params.photoid)
            .select('')
            .exec((err, photo) => {
                if (err) {
                    return res
                        .status(404)
                        .json({ success: false, message: 'Some unknown error occured. ' + err })
                } else {
                    if (!photo) {
                        return res
                            .status(404)
                            .json({ success: false, message: 'Picture not found, pls check and try again' });
                    }

                    const lift = ({
                        title: req.body.title,
                        time: req.body.time,
                        content: req.body.content
                    })

                    gallery
                        .updateOne({ _id: photo._id }, lift, (err, res) => {
                            if (err) {
                                return res
                                    .status(400)
                                    .json({ success: false, message: 'Error occured while updating photo details. ' + err });
                            } else {
                                res
                                    .status(200)
                                    .json({ success: true, message: 'Successfully updated photo details.' })
                            }
                        });
                }
            });

    } else {
        return res
            .status(404)
            .json({ success: false, message: 'Bad request. Pls provide valid photo' });
    }
};


// Delete a photo from the gallery
const deletePic = (req, res) => {
    if (req.params.photoid) {
        gallery
            .findByIdAndDelete(req.params.photoid, (err, res) => {
                if (err) {
                    return res
                        .status(404)
                        .json({ success: false, message: 'Error deleting photo. ' + err });
                } else {
                    return res
                        .status(204)
                        .json({ success: true, message: 'Successfully deleted photo' });
                }
            });
    } else {
        return res
            .status(404)
            .json({ success: true, message: 'Pls provide a picture to be deleted' });
    }
};

// export all controllers for use outside file

module.exports = {
    postPic,
    updatePic,
    getPics,
    deletePic
};