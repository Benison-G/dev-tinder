const express = require("express");


const app = express();

app.get("/hello", (req, res) => {
    res.send("Hello from the server from hello route.....")
})

app.listen(5000, () => {
    console.log("Server is listening on port 5000...");
})