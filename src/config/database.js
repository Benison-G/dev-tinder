const mongoose = require("mongoose");

const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]); // Hack to run mongo on my machine
// TIPPP: Add 0.0.0.0/0 in IP access list of atlas remove this IP restriction at all. But this is a security leak

const connectToDB = async () => {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
}

module.exports = connectToDB;