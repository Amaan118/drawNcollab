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
        newUser.color = await getColor(colors, res);

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


// @route /signup/google
// @method POST
// @desc Creates a new user based on the data received from Google Auth
exports.registerUserUsingGoogle = async (req, res) => {
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
        req.body.password = await generateRandomPassword(res);

        const newUser = await User.create(req.body);
        const colors = await User.find().select("color");
        newUser.color = await getColor(colors, res);

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


// @route /login/google
// @method POST
// @desc Lof=g In user based on the data received from Google Auth
exports.loginUserUsingGoogle = async (req, res) => {
    try {
        if (req.cookies.drawNcollab) {
            throw new Error("Already Logged in.")
        }
        const { email } = req.body;

        const user = await User.findOne({ email: email });
        if (user) {
            await sendTokenResponse(res, user, 301);
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
    try {
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
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


// @desc A Helper function which generates any random color which is not already provided to any other user
const getColor = async (colors, res) => {
    try {
        const newMap = new Map();
        for (let color of colors) {
            newMap.set(color, 1);
        }

        let red, green, blue, color = colors[0];
        while (newMap.has(color)) {
            red = random(1, 255);
            green = random(1, 255);
            blue = random(1, 255);

            color = `rgb(${red}, ${green}, ${blue})`;
        }

        return color;
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const generateRandomPassword = async (res) => {
    try {
        let password = "";
        let i;
        while (password.length != 8) {
            i = random(1, 3);
            switch (i) {
                case 1:
                    password += random(0, 9);
                    break;
                case 2:
                    password += String.fromCharCode(random(97, 122));
                    break;
                default:
                    password += "@";
                    password += "#";
            }
        }

        return password;
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}
