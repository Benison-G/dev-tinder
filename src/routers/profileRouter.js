const express = require("express");
const { authMiddleWare } = require("../middlewares/auth");
const { validateProfileUpdateRequest } = require("../utils/validateReq");

const profileRouter = express.Router();

profileRouter.post("/profile/view", authMiddleWare, async (req, res) => {
    try {
        res.send(req.user)
    } catch (err) {
        res.status(500).send(err.message);
    }
});

profileRouter.patch("/profile/edit", authMiddleWare, async (req, res) => {
    try {
        if (!validateProfileUpdateRequest(req)) {
            throw new Error("Cannot edit some fields")
        }
        const loggedinUser = req.user;
        Object.keys(req.body).forEach((k) => loggedinUser[k] = req.body[k]);

        loggedinUser.save();
        res.send("Profile updated successfully")
    } catch (err) {
        res.status(500).send(err.message);
    }
})

module.exports = profileRouter;