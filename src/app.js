const express = require("express");
const { authMiddleWare } = require("./middlewares/auth");
const connectToDB = require("./config/database");

const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "Nuthan",
        lastName: "Mithra",
        email: "nuthan.mithra@gmail.com",
        password: "Nuthan@2022",
        age: "4",
        gender: "Male"
    });
    try {
        await user.save();
        res.send("User created successfully");
    } catch(err) {
        res.send("Could not added the user!!!")
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