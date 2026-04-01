const express = require('express');
const router = express.Router();
const messageModel = require('../schemas/messages');
const { CheckLogin } = require('../utils/authHandler');
const { uploadAll } = require('../utils/uploadHandler');
const mongoose = require('mongoose');

// GET /api/v1/messages - Get last message with each user current user has chatted with
router.get('/', CheckLogin, async function (req, res, next) {
    try {
        const lastMessages = await messageModel.aggregate([
            {
                $match: {
                    $or: [
                        { from: req.user._id },
                        { to: req.user._id }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$from", req.user._id] },
                            then: "$to",
                            else: "$from"
                        }
                    },
                    lastMessage: { $first: "$$ROOT" }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $project: {
                    'user.password': 0,
                    'user.loginCount': 0,
                    'user.isDeleted': 0
                }
            }
        ]);
        res.send(lastMessages);
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

// GET /api/v1/messages/:userID - Get conversation history with userID
router.get('/:userID', CheckLogin, async function (req, res, next) {
    try {
        const userID = mongoose.Types.ObjectId(req.params.userID);
        const messages = await messageModel.find({
            $or: [
                { from: req.user._id, to: userID },
                { from: userID, to: req.user._id }
            ]
        }).sort({ createdAt: 1 });
        res.send(messages);
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

// POST /api/v1/messages - Send message (supports text/file)
router.post('/', CheckLogin, uploadAll.single('file'), async function (req, res, next) {
    try {
        const { to, text } = req.body;
        let messageContent = {
            type: 'text',
            text: text
        };

        if (req.file) {
            messageContent.type = 'file';
            messageContent.text = req.file.path;
        }

        const newMessage = new messageModel({
            from: req.user._id,
            to: to,
            messageContent: messageContent
        });

        await newMessage.save();
        res.send(newMessage);
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

module.exports = router;
