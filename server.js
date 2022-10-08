const express = require('express');
const path = require("path");
const cookie_parser = require("cookie-parser");


// Initialise a connection to the database
require('./config/db')();


// Load environment variables
const dotenv = require('dotenv');
dotenv.config({ path: "./config/.env" });

const PORT = process.env.PORT || 3000;

// Create a server and initialize the sockets
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketIO = require("socket.io");

io = socketIO(server);


// Define socket and events and what happens for those events
io.on("connection", (socket) => {
    console.log("Connection : ", socket.id);

    socket.on("disconnect", () => {
        console.log("Disconnected User: ", socket.id);
    });

    socket.on("broadcast-data", (data) => {
        socket.broadcast.emit("show-data", data);
    });

    socket.on("clear-all", () => {
        io.sockets.emit("clear-all-boards");
    });
});


// Set directory paths
const viewPath = path.join(__dirname, "./views");
const publicPath = path.join(__dirname, "./public");

app.set("view engine", "hbs");
app.set('views', viewPath);
app.use(express.static(publicPath));

// Allow cookies and data rendering between pages
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookie_parser());


// Define routes and endpoints
const routes = require("./src/routes/routes.js");
app.use("/", routes);


// Start the server
server.listen(PORT, () => {
    console.log(`Server started on Port : ${PORT}`);
});