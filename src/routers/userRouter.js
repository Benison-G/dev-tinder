const express = require("express");
const { authMiddleWare } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const user = require("../models/user");

const userRouter = express.Router();

userRouter.get("/user/connections/recieved", authMiddleWare, async (req, res) => {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status: "interested"
    }).populate("fromUserId", "firstName lastName");

    res.send({
        message: "Fetched connections requests successfully",
        data: connections
    })
})

userRouter.get("/user/connections", authMiddleWare, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [
                {
                    toUserId: loggedInUser._id,
                    status: "accepted"
                },
                {
                    fromUserId: loggedInUser._id,
                    status: "accepted"
                },
            ]

        }).populate("fromUserId", "firstName lastName");

        res.send({
            message: "Fetched connections successfully",
            data: connections
        })
    } catch (err) {
        res.status(500).send(err.message)
    }
})

userRouter.get("/feed", authMiddleWare, async (req, res) => {
    try {
        const page = req.query.page || 0;
        const limit = req.query.limit || 10;

        const skip = (page - 1) * limit;
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: { $in: ["accepted", "interested"] } },
                { toUserId: loggedInUser._id, status: { $in: ["accepted", "interested"] } }
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();

        connectionRequests.forEach(req => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await user.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select("firstName lastName age gender skills about photoURL").skip(skip).limit(limit);

        res.send({
            message: "Fetched feed successfully",
            data: users
        })
    } catch (err) {
        res.status(500).send(err.message);
    }
})

module.exports = userRouter;