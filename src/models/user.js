const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate (value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address ", value)
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate (value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Specify correct gender!!")
            }
        }
    },
    photoURL: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOtWierCXpDqUvrbuoP4drf8g5rMQUqoGD3igeWN81-g&s=10"
    },
    about: {
        type: String,
        default: "This is my default about data!"
    },
    skills: {
        type: [String]
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);