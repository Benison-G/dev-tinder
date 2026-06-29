const express = require("express");
const { authMiddleWare } = require("./middlewares/auth");
const connectToDB = require("./config/database");
const { validateRequest } = require("./utils/validateReq");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const User = require("./models/user");

const app = express();

app.use(cookieParser());
app.use(express.json());

// Create an User
app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!validator.isEmail(email)) {
            throw new Error("Invalid credentials")
        }
        const user = await User.findOne({ email: email });

        const isValidUser = await bcrypt.compare(password, user?.password);

        if (!isValidUser) {
            throw new Error("Invalid credentials");
        }

        const token = jwt.sign({ _id: user._id }, "NamastheBen@1991");

        res.cookie("token", token)

        res.send("Logged in successfully");
    } catch (err) {
        res.status(500).send(err.message);
    }
})

app.post("/profile", async (req, res) => {
    try {
        const { token } = req.cookies;

        const decodedMessage = await jwt.verify(token, "NamastheBen@1991")
        const { _id } = decodedMessage;

        const user = await User.findOne({ _id: _id });
        if (!user) {
            throw new Error("User not found");
        }
        res.send(user)
    } catch (err) {
        res.status(500).send(err.message);
    }
})

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