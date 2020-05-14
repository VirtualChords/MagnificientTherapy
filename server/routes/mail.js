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

// start creating & connecting mail service
var Imap = require('imap'),
    inspect = require('util').inspect;

// Import a mail parser
const { simpleParser } = require('mailparser')

var imap = new Imap({
    user: 'dvicsblue@gmail.com',
    password: '2522523779',
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    // keepalive: true
});
// imap.connect();



function openInbox(cb) {
    imap.openBox('INBOX', false, cb);
};
function getbox() {
    imap.getBoxes('[Gmail]', function (err, boxes) {
        console.log(boxes)
    })
}


function openSent(cb) {
    imap.openBox("[Gmail]/Sent Mail", false, cb);
}

imap.once('ready', function () {
    getbox()
    console.log(imap.namespaces.personal)
    // Routes for inboxes
    router.get('/inbox', function (req, res) {
        openInbox(function (err, box) {
            console.log(box)
            if (err) throw err;
            var f = imap.seq.fetch('*', {
                bodies: '',
                struct: true
            });
            f.on('message', function (msg, seqno) {
                console.log('Message #%d', seqno);
                // res.json({ success: true, message: 'Message #%d', seqno})
                var prefix = '(#' + seqno + ') ';
                msg.on('body', function (stream, info) {
                    stream.setEncoding('utf8');
                    simpleParser(stream, (err, mail) => {
                        console.log(prefix + mail.subject);
                        console.log(prefix + mail.text);
                        console.log(mail.headers.get('subject'));

                        let header = {
                            subject: mail.headers.get('subject'),
                            date: mail.headers.get('date'),
                            from: mail.headers.get('from').text,
                            to: mail.headers.get('to').text,
                            cc: mail.headers.get('cc')
                        }

                        res.json({ header: header, text: mail.text, html: mail.html, uid: req.uid, flags: req.flags })


                    });
                });
                msg.once('attributes', function (attrs) {
                    // console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
                    req.uid = attrs.uid
                    req.flags = attrs.flags
                    console.log(attrs)
                });
                msg.once('end', function () {

                    console.log(prefix + 'Finished');
                });
            });
            f.once('error', function (err) {
                console.log('Fetch error: ' + err);
            });
            f.once('end', function () {
                console.log('Done fetching all messages!');
                // imap.end();
            });
        });
    });

    // get and mark seen an individual message
    router.get('/inbox/:uid', function (req, res) {
        openInbox(function (err, box) {
            console.log(box.messages.total)
            if (err) throw err;
            var f = imap.fetch(req.params.uid, {
                bodies: '',
                markSeen: true,
                struct: true
            });
            f.on('message', function (msg, seqno) {
                console.log('Message #%d', seqno);
                // res.json({ success: true, message: 'Message #%d', seqno})
                var prefix = '(#' + seqno + ') ';
                msg.on('body', function (stream, info) {
                    stream.setEncoding('utf8');
                    simpleParser(stream, (err, mail) => {
                        console.log(prefix + mail.subject);
                        console.log(prefix + mail.text);
                        console.log(mail.headers.get('subject'));

                        let header = {
                            subject: mail.headers.get('subject'),
                            date: mail.headers.get('date'),
                            from: mail.headers.get('from').text,
                            to: mail.headers.get('to').text,
                            cc: mail.headers.get('cc')
                        }

                        res.json({ success: true, header: header, text: mail.text, html: mail.html, uid: req.uid, flags: req.flags })


                    });
                });
                msg.once('attributes', function (attrs) {
                    // console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
                    req.uid = attrs.uid
                    req.flags = attrs.flags
                    console.log(attrs)
                });
                msg.once('end', function () {

                    console.log(prefix + 'Finished');
                });
            });
            f.once('error', function (err) {
                console.log('Fetch error: ' + err);
            });
            f.once('end', function () {
                console.log('Done fetching all messages!');
                // imap.end();
            });
        });
    });

    // add flag to an individual message or messages
    router.post('/inbox/:uid/:flags', function (req, res) {
        openInbox(function (err, box) {
            console.log(box.messages.total)

            function flagUp(source, flag) {
                imap.addFlags(source, flag, (err) => {
                    if (err) {
                        console.log(err)
                        res.json(err)
                    } else {
                        res.json({ success: true })
                    }
                })
            }
            if (err) {
                throw err;
            } else {
                // find the message to add flags to and add flags
                flagUp(req.params.uid, req.params.flags)
            }
        });
    });

    // remove flags from a particular message or messages.
    router.delete('/inbox/:uid/:flags', function (req, res) {
        openInbox(function (err, box) {
            console.log(box.messages.total)

            function flagDown(source, flag) {
                imap.delFlags(source, flag, (err) => {
                    if (err) {
                        console.log(err)
                        res.json(err)
                    } else {
                        res.json({ success: true })
                    }
                })
            }
            if (err) {
                throw err;
            } else {
                // find the message to add flags to and add flags
                flagDown(req.params.uid, req.params.flags)
            }
        });
    });


    // Routes for sent mails
    router.get('/sent', function (req, res) {
        openSent(function (err, box) {
            console.log(box)
            if (err) throw err;
            var f = imap.seq.fetch('*', {
                bodies: '',
                struct: true
            });
            f.on('message', function (msg, seqno) {
                console.log('Message #%d', seqno);
                // res.json({ success: true, message: 'Message #%d', seqno})
                var prefix = '(#' + seqno + ') ';
                msg.on('body', function (stream, info) {
                    stream.setEncoding('utf8');
                    simpleParser(stream, (err, mail) => {
                        console.log(prefix + mail.subject);
                        console.log(prefix + mail.text);
                        console.log(mail.headers.get('subject'));

                        let header = {
                            subject: mail.headers.get('subject'),
                            date: mail.headers.get('date'),
                            from: mail.headers.get('from').text,
                            to: mail.headers.get('to').text,
                            cc: mail.headers.get('cc')
                        }
                        res.json({ header: header, text: mail.text, html: mail.html, uid: req.uid, flags: req.flags })


                    });
                });
                msg.once('attributes', function (attrs) {
                    // console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
                    req.uid = attrs.uid
                    req.flags = attrs.flags
                    console.log(attrs)
                });
                msg.once('end', function () {

                    console.log(prefix + 'Finished');
                });
            });
            f.once('error', function (err) {
                console.log('Fetch error: ' + err);
            });
            f.once('end', function () {
                console.log('Done fetching all messages!');
                // imap.end();
            });
        });
    });

    // individual sent mail
    router.get('/sent/:uid', function (req, res) {
        openSent(function (err, box) {
            console.log(box.messages.total)
            if (err) throw err;
            var f = imap.fetch(req.params.uid, {
                bodies: '',
                markSeen: true,
                struct: true
            });
            f.on('message', function (msg, seqno) {
                console.log('Message #%d', seqno);
                // res.json({ success: true, message: 'Message #%d', seqno})
                var prefix = '(#' + seqno + ') ';
                msg.on('body', function (stream, info) {
                    stream.setEncoding('utf8');
                    simpleParser(stream, (err, mail) => {
                        console.log(prefix + mail.subject);
                        console.log(prefix + mail.text);
                        console.log(mail.headers.get('subject'));

                        let header = {
                            subject: mail.headers.get('subject'),
                            date: mail.headers.get('date'),
                            from: mail.headers.get('from').text,
                            to: mail.headers.get('to').text,
                            cc: mail.headers.get('cc')
                        }

                        res.json({ success: true, header: header, text: mail.text, html: mail.html, uid: req.uid, flags: req.flags })


                    });
                });
                msg.once('attributes', function (attrs) {
                    // console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
                    req.uid = attrs.uid
                    req.flags = attrs.flags
                    console.log(attrs)
                });
                msg.once('end', function () {

                    console.log(prefix + 'Finished');
                });
            });
            f.once('error', function (err) {
                console.log('Fetch error: ' + err);
            });
            f.once('end', function () {
                console.log('Done fetching all messages!');
                // imap.end();
            });
        });
    });

    router.post('/sent/:uid/:flags', function (req, res) {
        openSent(function (err, box) {
            console.log(box.messages.total)

            function flagUp(source, flag) {
                imap.addFlags(source, flag, (err) => {
                    if (err) {
                        console.log(err)
                        res.json(err)
                    } else {
                        res.json({ success: true })
                    }
                })
            }
            if (err) {
                throw err;
            } else {
                // find the message to add flags to and add flags
                flagUp(req.params.uid, req.params.flags)
            }
        });
    });

    // remove flags from a particular message or messages.
    router.delete('/sent/:uid/:flags', function (req, res) {
        openSent(function (err, box) {
            console.log(box.messages.total)

            function flagDown(source, flag) {
                imap.delFlags(source, flag, (err) => {
                    if (err) {
                        console.log(err)
                        res.json(err)
                    } else {
                        res.json({ success: true })
                    }
                })
            }
            if (err) {
                throw err;
            } else {
                // find the message to add flags to and add flags
                flagDown(req.params.uid, req.params.flags)
            }
        });
    });
});


imap.once('error', function (err) {
    console.log(err);
    imap.connect()
});

imap.once('end', function () {
    console.log('Connection ended');
    // imap.connect()
});

imap.connect();

module.exports = router;