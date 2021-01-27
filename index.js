const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
// Allow cross-origin
app.use(cors());
app.options("*", cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
// Bodyparser Middleware
app.use(express.json());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());




// Serve static assets if in production
// Set static folder
app.use(express.static("prf-form/build"));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "prf-form/build", "index.html"));
});



// const port = process.env.PORT || 80;
const port = 3100;
app.listen(port, () => console.log(`Server started on port ${port}`));
