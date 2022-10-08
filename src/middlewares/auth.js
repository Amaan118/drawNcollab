const jwt = require("jsonwebtoken");
const User = require("../models/User");


const authenticate = async (req, res, next) => {
    try {
        // If there is no cookie named drawNcollab then return user to login page
        if (!req.cookies.drawNcollab) {
            res.redirect("/login");
        }
        else {
            const token = req.cookies.drawNcollab;
            if (token) {
                // Verify the cookie to access the user's id
                const verified = jwt.verify(token, process.env.SECRET_KEY);

                const user = await User.findById({ _id: verified.id });
                req.token = token;
                req.user = user;

                next();
            }
            else {
                throw new Error("Please Login to acccess this feature.")
            }
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


module.exports = authenticate;