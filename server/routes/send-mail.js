const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const admin = require('../models/admin');
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

const nodemailer = require("nodemailer");

router.post('/send', auth, function (req, res) {
  let transporter = nodemailer.createTransport({
    // host: "smtp.ethereal.email",
    // port: 587,
    // secure: false, // true for 465, false for other ports
    service: 'gmail',
    auth: {
      user: "dvicsblue@gmail.com", // generated ethereal user
      pass: "2522523779" // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // send mail with defined transport object
  let messageOptions = {
    from: '"VirtualChords 👻" <virtualchords@magnitherapy.com>', // sender address
    to: [req.body.to], // list of receivers
    subject: req.body.subject,//"Hello ✔", // Subject line
    text: req.body.message, //"Hello world?", // plain text body
    cc: [req.body.copy]
    // html: "<b>Hello world?</b>" // html body
  };

  transporter.sendMail(messageOptions, function (err, info) {
    if (err) {
      res.json({ success: false, err })
      console.log(err)
    } else {
      res.json({ success: true, message: 'Message Sent to ' + req.body.to })
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview only available when sending through an Ethereal account
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
  });
});

module.exports = router;