const mongoose = require('mongoose');
const todo = require('../../models/todo');
const admin = require('../../models/admin');

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


// Get Single and Many Todos
const getTodo = (req, res) => {
    if (req.params.todoId) {
        todo
            .findById(req.params.todoId, (err, todo) => {
                if (err) {
                    res.json({ success: false, message: 'Some error occured' })
                } else if (!todo) {
                    res.json({ success: false, message: 'Could not find todo...' })
                } else {
                    res.json({ success: true, todo })
                }
            });
    } else {
        todo
            .find((err, todos) => {
                if (err) {
                    res.json({ susccess: false, message: 'Some error occured while getting todo list' })
                } else if (!todos) {
                    res.json({ success: false, message: 'Could not get todo lists' })
                } else {
                    res.json({ success: true, todos })
                }
            });
    };
};

// Delete Todo
const deleteTodo = (req, res) => {
    getAdmin(req, res, (req, res, user) => {
        if (req.params.todoId) {
            todo
                .findById(req.params.todoId, (err, todoo) => {
                    if (err) {
                        res.json({ success: false, message: 'Some error occured' })
                    } else if (!todoo) {
                        res.json({ success: false, message: 'To-do item not found' })
                    } else {
                        if (todoo.createdBy != user.username) {
                            res.json({ success: false, message: "You didn't create this to-do item" });
                        } else {
                            todo
                                .findByIdAndDelete(req.params.todoId, (err, done) => {
                                    if (err) {
                                        res.json({ success: false, message: 'An error occured while removing to-do' })
                                    } else {
                                        res.json({ success: true, done })
                                    }
                                });
                        };
                    };
                });
        } else {
            res.json({ success: false, message: 'Please provide an item to be removed' });
        }
    });
};

// Post a todo item
const postTodo = (req, res) => {
    let compose = {
        title: req.body.title,
        createdBy: req.body.createdBy,
        due: req.body.due
    }
    if (req.body || req.body != null || req.body != '') {
        todo
            .create(compose, (err, done) => {
                if (err) {
                    res.json({ success: false, message: 'Unable to create todo item. An error occured' });
                } else {
                    res.json({ success: true, message: 'To-do created', done })
                }
            });
    } else {
        res.json({ success: false, message: 'Nothing was provided' })
    };
};


// update a todo item

const updateTodo = (req, res) => {
    let UpdateTodo = {
        title: req.body.title,
        createdBy: req.body.createdBy,
        due: req.body.due
    }
    if(req.params.todoId){
        todo
        .findById(req.params.todoId, (err, Todo)=>{
            if(err){
                res.json({ success: false, message: 'Some error occured'});
            } else if (!Todo){
                res.json({ success: false, message: 'Oops, could not find particular item'});
            } else {
                Todo
                .update(UpdateTodo, (err, done) => {
                    if(err){
                        res.json({success:false, message: 'unable to update item'})
                    } else {
                        res.json({ success: true, message: 'Successfilly updated. Dont miss the appointment', done});
                    }
                });
            };
        });
    } else {
        res.json({ success: false, message: 'please provide an item to update'});
    };
};



module.exports = {
    getTodo,
    postTodo,
    updateTodo,
    deleteTodo
}