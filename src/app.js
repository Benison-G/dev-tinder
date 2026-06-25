const express = require("express");
const { authMiddleWare } = require("./middlewares/auth");
const connectToDB = require("./config/database");

const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.send("User created successfully");
    } catch (err) {
        res.send("Could not added the user!!!")
    }
});

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

// Get all users
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users);
    } catch (err) {
        res.status(401).send("No users found");
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
app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {
        const user = await User.findByIdAndUpdate({_id: userId }, data);
        res.send("Updated the user successfully");
    }
    catch (err) {
        res.status(500).send("Could not update");
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