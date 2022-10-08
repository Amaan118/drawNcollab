const express = require('express');
const router = express.Router();

// Create a authentication middleware which checks and allows users only if they are logged in
const authenticate = require('../middlewares/auth');

// Initialize multer since we are dealing with images of users
const multer = require("multer");

// Define the destination path of multer like where the file will be stored after user uploads the file
const upload = multer({ dest: "public/uploads/" });


// These are Authentication Routes, each route having a controller attached to them
const { renderRegisterPage, renderLoginPage, registerNewUser, loginUser, logoutUser, getColorNow } = require("../controllers/userAuth");
router.get("/", renderLoginPage);
router.get("/signup", renderRegisterPage);
router.get("/login", renderLoginPage);
router.post("/signup", registerNewUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/color", getColorNow);


// These are Operations Controllers and Routes
const { drawonBoard, getImage, uploadImage, saveImage } = require("../controllers/userOperations");
router.get("/draw", authenticate, drawonBoard);
router.get("/upload/profile", authenticate, getImage);
router.post("/upload/profile", authenticate, upload.single("profile"), uploadImage);
router.post("/add/sketch", authenticate, saveImage);


// This is the 404 Error route like for any route other than what we have defined above, we will send error message
router.get("/*/*", (req, res) => {
    res.status(404).json({
        success: false,
        data: "Invalid Web Page"
    })
})


// Lastly export the router
module.exports = router;