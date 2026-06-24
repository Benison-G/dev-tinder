const express = require("express");


const app = express();

app.get("/gethello", (req, res) => {
    res.send("Hello from the server from get hello..... new udpate again and again")
})

app.listen(5000, () => {
    console.log("Server is listening on port 5000...");
})