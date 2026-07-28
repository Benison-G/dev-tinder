const express = require("express");
const { authMiddleWare } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();
const sendEmail = require("../utils/sendEmail");

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

        const emailRes = await sendEmail.run(
            "A new friend request from " + req.user.firstName,
            req.user.firstName + " is " + status + " in " + userInfo.firstName,
            userInfo.email
        );
        console.log(emailRes);

        if (status === "interested") {
            res.send("Your interest to " + userInfo.firstName + " sent successfully")
        } else {
            res.send("Your ignored " + userInfo.firstName)
        }
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId", authMiddleWare, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ messaage: "Status not allowed!" });
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",
        });
        if (!connectionRequest) {
            return res
                .status(404)
                .json({ message: "Connection request not found" });
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.json({ message: "Connection request " + status, data });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
}
);

module.exports = requestRouter;