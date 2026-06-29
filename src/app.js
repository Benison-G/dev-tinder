const express = require("express");
const { authMiddleWare } = require("./middlewares/auth");
const connectToDB = require("./config/database");
const { validateRequest } = require("./utils/validateReq");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const User = require("./models/user");
const profileRouter = require("./routers/profileRouter");
const authRouter = require("./routers/authRouter");
const requestRouter = require("./routers/requestRouter");

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/", authRouter, profileRouter, requestRouter);

// Get all users
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users);
    } catch (err) {
        res.status(401).send("No users found");
    }
})

// Get user by email ID
app.get("/user", async (req, res) => {
    const emailId = req.body.email;
    try {
        const users = await User.find({ email: emailId })
        res.send(users);
    } catch (err) {
        res.status(401).send("Could not find the user");
    }
})

// Delete a user
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findOneAndDelete(userId);
        res.send({ message: "User deleted successfully", user });
    } catch (err) {
        res.status(500).send("Something went wrong");
    }
})

// Update an user
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params.userId;
    const data = req.body;

    try {
        const ALLOWED_FIELDS = ["firstName", "lastName", "password", "photoURL", "about", "skills"];

        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_FIELDS.includes(k));
        if (!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }

        const user = await User.findByIdAndUpdate(userId, data, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.send("Updated the user successfully");
    } catch (err) {
        res.status(500).send(err.message);
    }
})

connectToDB().then(() => {
    console.log("Connected to database successfully");
    // This is to ensure DB connection before listening to the requests
    app.listen(5000, () => {
        console.log("Server is listening on port 5000...");
    })
}).catch((err) => {
    console.error(err);
});