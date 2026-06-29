const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const {validateRequest} = require("../utils/validateReq");
const validator = require("validator")

const authRouter = express.Router();
// Create an User
authRouter.post("/signup", async (req, res) => {
    const user = new User(req.body);
    try {
        validateRequest(req);

        const { firstName, lastName, email, password } = req.body;

        // Encryption of password
        const encryptedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: encryptedPassword
        });

        await user.save();
        res.send("User created successfully");
    } catch (err) {
        res.send(err.message)
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!validator.isEmail(email)) {
            throw new Error("Invalid credentials")
        }
        const user = await User.findOne({ email: email });

        const isValidUser = await user.validatePassword(password);

        if (!isValidUser) {
            throw new Error("Invalid credentials");
        }


        // Added expiry for token
        const token = await user.getJWT();

        // Exprirse in a day and works for httpOnly
        res.cookie("token", token, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true
        })

        res.send("Logged in successfully");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = authRouter;