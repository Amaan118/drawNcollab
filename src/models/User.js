const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const validator = require('validator');
const bcrypt = require("bcryptjs");


const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "Please provide first name."]
    },
    lastname: {
        type: String,
        required: [true, "Please provide last name."]
    },
    email: {
        type: String,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email.")
            }
        },
        required: [true, "Please provide email."]
    },
    password: {
        type: String,
        validate(value) {
            if (value.length < 3) {
                throw new Error("Minimum Password length is 3.")
            }
        },
        required: [true, "Please provide password."]
    },
    drawings: [{
        type: String
    }],
    color: {
        type: String
    },
    profile: {
        type: String
    }
});


UserSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
        expiresIn: "1h",
    });
    return token;
};


UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});


const User = mongoose.model("drawNcollab", UserSchema, "users");

module.exports = User;