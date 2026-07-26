const express = require("express");
const { authMiddleWare } = require("../middlewares/auth");
const { validateProfileUpdateRequest } = require("../utils/validateReq");
const user = require("../models/user");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", authMiddleWare, async (req, res) => {
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
        Object.keys(req.body).forEach((k) => {
            const fieldName = k === "photoUrl" ? "photoURL" : k;
            loggedinUser[fieldName] = req.body[k];
        });

        await loggedinUser.save();
        res.send(loggedinUser);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

profileRouter.patch("/profile/password", authMiddleWare, async (req, res) => {
    try {
        const loggedinUser = req.user;

        const { oldPassword, newPassword, confirmNewPassword } = req.body;
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            throw new Error("Enter all fields..")
        }

        const isValidPassword = await loggedinUser.validatePassword(oldPassword);
        if (!isValidPassword) {
            throw new Error("Old password is incorrect");
        }

        if (newPassword !== confirmNewPassword) {
            throw new Error("new and confirm password does not match")
        }
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        loggedinUser.password = encryptedPassword;
        res.send("Password updated!!")
    } catch (err) {
        res.status(500).send(err.message);
    }
})

module.exports = profileRouter;