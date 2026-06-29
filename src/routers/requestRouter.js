const express = require("express");
const {authMiddleWare} = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectRequest", authMiddleWare, async (req, res) => {
    res.send("Connection sent")
})

module.exports = requestRouter;