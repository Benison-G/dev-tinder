const express = require("express");
const { authMiddleWare } = require("../middlewares/auth");
const ConnectionRequest  = require("../models/connectionRequest");

const userRouter = express.Router();

userRouter.get("/user/connections/recieved", authMiddleWare, async (req, res) => {
    const logggedInUser = req.user;
    const connections = await ConnectionRequest.find({
        toUserId: logggedInUser._id,
        status: "interested"
    }).populate("fromUserId", "firstName lastName");

    res.send({ 
        message: "Fetched connections successfully",
        data: connections
    })
})

module.exports = userRouter;