const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleWare = async (req, res, next) => {
    try {
        const { token } = req.cookies || {};

        if (!token) {
            return res.status(401).send("Please login");
        }

        const decodedMessage = await jwt.verify(token, "NamastheBen@1991");
        const { _id } = decodedMessage;

        const user = await User.findOne({ _id });

        if (!user) {
            return res.status(401).send("Please login");
        }

        req.user = user;

        return next();
    } catch (err) {
        return res.status(401).send("Invalid or expired token");
    }
}

module.exports = {
    authMiddleWare
}