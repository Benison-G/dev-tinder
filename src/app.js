const express = require("express");


const app = express();

app.use("/multiple-route", (req, res, next) => {
    console.log("handling first route")
    next();
}, (req, res) => {
    console.log("handling second route")
    res.send("Second response");
})

app.get("/hello", (req, res) => {
    res.send("Hello from the server from hello route.....")
})

app.get("/user-with-query", (req, res) => {
    res.json({ message: "Query param is", query: req.query });
});

app.get("/user-with-param/:userId", (req, res) => {
    res.json({ message: "Route param is", param: req.params.userId });
});

app.get("/user", (req, res) => {
    res.send({ firstName: "Nuthan", lastName: "Mithra" })
})

app.post("/user", (req, res) => {
    res.send("Saved successfully");
})

app.listen(5000, () => {
    console.log("Server is listening on port 5000...");
})