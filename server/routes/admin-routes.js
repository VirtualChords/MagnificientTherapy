const express = require('express');
const router = express.Router();
const gallery = require('./controllers/gallery');
const updates = require('./controllers/updates');
const team = require('./controllers/team');
const messages = require('./controllers/messages');
const todo = require('./controllers/todo');
const profile = require('./controllers/profile');
const jwt = require('express-jwt');
const auth = jwt({
    secret: process.env.secret,
    userProperty: 'payload',
    getToken: function (req) {
        if (req.headers["x-access-token"]) {
            return req.headers["x-access-token"];
        }
        return null;
    }
});




// route for gallery
router
    .route('/gallery/:photoid')
    .put(auth, gallery.updatePic)
    .get(auth, gallery.getPics)
    .delete(auth, gallery.deletePic);

router
    .route('/gallery')
    .post(auth, gallery.postPic)
    .get(auth, gallery.getPics);


// route for updates
router
    .route('/updates/:updateid')
    .get(auth, updates.getUpdates)
    .put(auth, updates.updateUpdate)
    .delete(auth, updates.deleteUpdate);

router
    .route('/updates')
    .post(auth, updates.postUpdate)
    .get(auth, updates.getUpdates);


// route for team members
router
    .route('/team/:teamMember')
    .put(auth, team.updateMember)
    .get(auth, team.getMember)
    .delete(auth, team.deleteMember);

router
    .route('/team')
    .post(auth, team.postMember)
    .get(auth, team.getMember);


// route for messages
router
    .route('/messages')
    .get(auth, messages.getMessages)
    // .post(auth, messages.postMessage);

router
    .route('/messages/:messageid')
    .get(auth, messages.getMessages)
    .post(auth, messages.postMessage);

router
    .route('/team')
    .get(auth, messages.getMessages)
    .post(auth, messages.postMessage);


    // Route for to-do list
router
    .route('/todo')
    .get(auth, todo.getTodo)
    .post(auth, todo.postTodo);

router
    .route('/todo/:todoId')
    .get(auth, todo.getTodo)
    .put(auth, todo.updateTodo)
    .delete(auth, todo.deleteTodo);

router
    .route('/profile')
    .put(auth, profile.updateProfile)
    .post(auth, profile.createProfile)


module.exports = router;