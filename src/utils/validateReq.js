const validator = require("validator");

const validateRequest = (req) => {
    const { firstName, lastName, email, age } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Please enter proper names..");
    }

    if (!validator.isEmail(email)) {
        throw new Error("Please enter valid email");
    }
}

module.exports = { validateRequest }