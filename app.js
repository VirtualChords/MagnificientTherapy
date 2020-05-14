require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const cors = require('cors');
const path = require('path');
const createError = require('http-errors');
const app = express();
const mongoose = require('mongoose')
const port = process.env.PORT || 8080;

// Routes
const admin = require('./server/routes/admin-routes');
const auth = require('./server/routes/auth');
const mail = require('./server/routes/mail');
const sendMail = require('./server/routes/send-mail')

// Middlewares
app.use(morgan('dev'));
app.use(cors({ origin: 'http://0.0.0.0:3000', exposedHeaders: 'x-access-token' }));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + '/public')));

// Routes MiddleWares
app.use('/auth', auth);
app.use('/admin', admin);
app.use('/mail', mail); // route for recieving mails
app.use('/email', sendMail); //route for sending mails


app.get('*', (req, res) => {
    // res.sendFile(path.join(__dirname + '/public/index.html'))
    res.sendFile(path.join(__dirname + '/adminator/src/index.html'))
});

// error handlers
// Catch unauthorised errors
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res
            .status(401)
            .json({ "message": err.name + ": " + err.message });
    }
});

// create errors
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



// Starting the server
app.listen(port, (err) => {
    if (err) {
        console.log('There was a problem running the server... ' + err)
    } else {
        console.log('Server running and listening on port ' + port)
    }
});

// Connecting to database
mongoose.connect(process.env.dbUri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, }, (err) => {
    if (err) {
        console.log('error connecting to ' + process.env.dbName + ' database. \n' + err)
    }
    console.log('connected to ' + process.env.dbName + ' database')
});



// General Error Response
// app.use(req, res, next)

// module.exports = app;