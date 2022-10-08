const User = require("../models/User");
const bcrypt = require("bcryptjs");


// @route /signup
// @method GET
// @desc Renders the signup page
exports.renderRegisterPage = async (req, res) => {
    res.status(200).render("signup");
}


// @route /signup
// @method POST
// @desc Creates a new document in database for the provided data and generates a cookie which is used throughout the process to identify the user
exports.registerNewUser = async (req, res) => {
    try {
        if (req.cookies.drawNcollab) {
            throw new Error("Already Logged in.")
        }
        else {
            const email = await User.findOne({ email: req.body.email });

            if (email) {
                throw new Error("Email already in use.");
            }
        }

        const newUser = await User.create(req.body);
        const colors = await User.find().select("color");
        newUser.color = await getColor(colors);

        await newUser.save();
        await sendTokenResponse(res, newUser, 201);
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


// @route /login
// @method GET
// @desc Renders the login page
exports.renderLoginPage = async (req, res) => {
    res.status(200).render("login");
}


// @route /login
// @method POST
// @desc Logs In the user with the provided creadentials and generates a cookie which is used throughout the process to identify the user
exports.loginUser = async (req, res) => {
    try {
        if (req.cookies.drawNcollab) {
            throw new Error("Already Logged in.")
        }
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                await sendTokenResponse(res, user, 301);
            }
            else {
                throw new Error("Password does not match!");
            }
        }
        else {
            throw new Error("User not found.");
        }
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


// @route /login
// @method GET
// @desc Clears the cookie and logs the user out
exports.logoutUser = async (req, res) => {
    try {
        if (!req.cookies.drawNcollab) {
            throw new Error("Please Login.")
        }
        res.clearCookie("drawNcollab").status(200).redirect("/login");
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


// @desc A Helper function which generates the cookie
const sendTokenResponse = async (res, user, statusCode) => {
    const token = await user.generateAuthToken();

    const options = {
        expires: new Date(
            Date.now() + 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === "production") {
        options.secure = true;
    }

    res.status(statusCode).cookie("drawNcollab", token, options).redirect("/draw");
}


// @desc A Helper function which generates any random color which is not already provided to any other user
const getColor = async (colors) => {
    const newMap = new Map();
    for (let color of colors) {
        newMap.set(color, 1);
    }

    let red, green, blue, color = colors[0];
    while (newMap.has(color)) {
        red = Math.floor(Math.random() * 255);
        green = Math.floor(Math.random() * 255);
        blue = Math.floor(Math.random() * 255);

        color = `rgb(${red}, ${green}, ${blue})`;
    }

    return color;
}