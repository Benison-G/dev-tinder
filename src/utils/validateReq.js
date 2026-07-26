const validator = require("validator");

const validateRequest = (req) => {
    const { firstName, lastName, email, age } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Please enter proper names..");
    }

    if (!validator.isEmail(email)) {
        throw new Error("Please enter valid email");
    }
};

const validateProfileUpdateRequest = (req) => {
    const { firstName, lastName, email, age, gender, photoURL, photoUrl, skills } = req.body;
    const allowedFields = ["firstName", "lastName", "email", "age", "photoURL", "photoUrl", "gender", "skills", "about"];

    return Object.keys(req.body).every((k) => allowedFields.includes(k));
}

module.exports = { validateRequest, validateProfileUpdateRequest }