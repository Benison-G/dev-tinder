const express = require("express");
const {authMiddleWare} = require("../middlewares/auth");

const profileRouter = express.Router();

profileRouter.post("/profile", authMiddleWare, async (req, res) => {
    try {
        res.send(req.user)
    } catch (err) {
        res.status(500).send(err.message);
    }
})

module.exports = profileRouter;