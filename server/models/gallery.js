const mongoose = require('mongoose');

// const comment = new mongoose.Schema({
//     name: {
//         type: String
//     }
// })

const gallerySchema = new mongoose.Schema({
    name: {
        type: [String]
    },
    title: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now()
    },
    // comments: [comments],
    content: {
        type: String
    }
});

module.exports = mongoose.model('gallery', gallerySchema);