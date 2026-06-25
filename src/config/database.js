const mongoose = require("mongoose");

const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]); // Hack to run mongo on my machine

const connectToDB = async () => {
    await mongoose.connect("mongodb+srv://sachinlg60_db_user:xbtWOPY5Mfgw7kTf@namastheben.m4j8fbh.mongodb.net/devTinder?appName=namastheben");
}

module.exports = connectToDB;