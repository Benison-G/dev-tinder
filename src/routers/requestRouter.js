const express = require("express");
const { authMiddleWare } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:userId", authMiddleWare, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;

        if (!["interested", "ignored"].includes(status)) {
            throw new Error("Its an invalid status");
        }
        const userInfo = await User.findById(toUserId);
        if (!userInfo) {
            throw new Error("User does not exist");
        }

        // Check if request send and request received with logical or keyword
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        if (existingConnectionRequest) {
            throw new Error("Connect already sent");
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        })

        const userData = await connectionRequest.save();
        if (status === "interested") {
            res.send("Your interest to " + userInfo.firstName + " sent successfully")
        } else {
            res.send("Your ignored " + userInfo.firstName)
        }
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
})

module.exports = requestRouter;