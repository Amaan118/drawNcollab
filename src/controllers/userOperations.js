const User = require("../models/User");
const fs = require("fs");
const path = require("path");


// @route /draw
// @method GET
// @desc Renders the draw page along with the data of all the side menu's
exports.drawonBoard = async (req, res) => {
    let accounts = await User.find().select("firstname lastname color");

    accounts = accounts.filter(acc => {
        return acc._id.toString() != req.user._id.toString();
    });

    res.render("draw", { user: req.user, profile_img: req.user.profile || null, sketches: req.user.drawings, accounts: accounts });
}


// @route /upload/profile
// @method GET
// @desc Renders the upload profile picture page
exports.getImage = async (req, res) => {
    res.status(200).render("upload");
}


// @route /upload/profile
// @method POST
// @desc When the image is received after user sends it, we store it in system and updates the user profile
exports.uploadImage = async (req, res) => {
    try {
        const file = req.file;
        const activeUser = req.user;

        if (file.mimetype !== "image/png" && file.mimetype !== "image/jpg" && file.mimetype !== "image/jpeg") {
            throw new Error("Invalid Image.");
        }
        else if (file.size / 1024 > 5000) {
            throw new Error("Maximum Image size is 5mb.");
        }

        const filePath = path.join(__dirname, "../../", file.destination);

        const oldPath = filePath + file.filename;
        const fileExt = file.mimetype.split("/")[1];

        const newPath = filePath + activeUser._id.toString() + "." + fileExt;
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                throw new Error(err);
            }
            else {
                console.log("Rename Successfull.")
            };
        });

        const newFilePath = `${file.destination.split("/")[1]}/${activeUser._id.toString()}.${fileExt}`
        activeUser.profile = newFilePath;
        await activeUser.save();

        res.redirect("/draw");
    }
    catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
}


// @route /add/sketch
// @method POST
// @desc Creates an image based on what sketch the user had drawn
exports.saveImage = async (req, res) => {
    try {
        const activeUser = req.user;
        let imageData = req.body["image-input"];

        const path = "public/uploads/" + activeUser._id.toString() + "-" + (activeUser.drawings.length + 1) + ".png";
        fs.writeFile(path, imageData, (err) => {
            if (err) {
                throw new Error(err);
            }
            console.log("File Saved.");
        });

        activeUser.drawings.push(path);

        await activeUser.save();

        res.redirect("/draw");
    }
    catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
}