const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleWare = async (req, res, next) => {
    try {
        const cookie = req.cookies;
        const { token } = cookie;
        if (!token) {
            res.status(401).send("Please login");
        }
        const decodedMessage = await jwt.verify(token, "NamastheBen@1991");
        const { _id } = decodedMessage;

        const user = await User.findOne({ _id: _id });

        if (!user) {
            throw new Error("User not found")
        }

        req.user = user;

        next();

    } catch (err) {
        res.status(500).send(err.message)
    }
}

module.exports = {
    authMiddleWare
}