const sequenceGenerator = require('./sequenceGenerator');
const Message = require('../models/message');

var express = require('express');
var router = express.Router();
module.exports = router; 

router.get("/", (req, res, next) => {
    Message.find()
    .then(message => {
        res.status(200).json({
            message: "Messages fetched successfully!",
            posts: message
        });
    })
    .catch(error => {
        res.status(500).json({
            message: 'An error occurred',
            error: error
        });
    });
});

router.post('/', (req, res, next) => {
    const maxMessageId = sequenceGenerator.nextId("messages");

    const message = new Message({
        id: maxMessageId,
        subject: req.body.subject,
        msgText: req.body.msgText,
        sender: req.body.id
    });

    message.save()
    .then(createMessage => {
        res.status(201).json({
            message: 'Message added successfully',
            createdMessage: createMessage
        });
    })
    .catch(error => {
        res.status(500).json({
            message: 'An error occurred',
            error: error
        });
    });
});

router.put(':id', (req, res, next) => {
    Message.findOne({ id: req.params.id })
    .then(message => {
        message.subject = req.body.subject;
        message.msgText = req.body.msgText;

        Message.updateOne({ id: req.params.id }, message)
        .then(result => {
            res.status(204).json({
                message: 'Message updated successfully'
            })
        })
        .catch(error => {
            res.status(500).json({
                message: 'An error occurred',
                error: error
            });
        });
    })
    .catch(error => {
        res.status(500).json({
            message: 'Message not found.',
            error: { message: 'Message not found'}
        });
    });
});

// router.delete(":id", (req, res, next) => {
//     Message.findOne({ id: req.params.id })
//     .then(message => {
//         Message.deleteOne({ id: req.params.id })
//         .then(result => {
//             res.status(204).json({
//                 message: "Message deleted successfully"
//             });
//         })
//         .catch(error => {
//             res.status(500).json({
//                 message: 'An error occurred',
//                 error: error
//             });
//         })
//     })
//     .catch(error => {
//         res.status(500).json({
//             message: 'Message not found.',
//             error: { message: 'Message not found'}
//         });
//     });
// });