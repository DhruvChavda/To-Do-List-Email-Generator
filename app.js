require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const _ = require("lodash");
const { result } = require("lodash");

const app = express();

// google APIs setup

//bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

//static
app.use(express.static("public"));

// GET
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// POST
app.post("/", (req, res) => {
    const userEmail = req.body.email;
    const userNick = _.capitalize(req.body.nname);
    const userName = encodeURI(req.body.fname);
    const url = `${process.env.TODO}${userNick}`;
    const encodedUrl = encodeURI(url);

    let message = `Hello! ${userName}

Here's the link to your personal to-do list:

${encodedUrl}

This Link will automatically save your notes and you can open it from anywhere/ anydevice with ease. So star it, save it, bookmark it - its yours! 

Now open it on laptop or mobile, it will automatically sync all your data!

If you find any issues using this list, you can always reply to this message.

Have fun!
DMC`;

    let transporter = nodemailer.createTransport({
        service: "gmail",
        port:465,
        auth: {
            user: process.env.AUTH_USER,
            pass: process.env.AUTH_PASS,
        },
    });

    let mailOptions = {
        from: '"To Do List! 📜" <2fpsgames@gmail.com>', // sender address
        to: userEmail, // list of receivers
        subject: "Here's Your Link", // Subject line
        text: message,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log("Error Occured Email Not Sent", err);
            res.sendFile(__dirname + "/failure.html");
        } else {
            console.log("Email sent");
            res.sendFile(__dirname + "/success.html");
        }
    });
});

//success post
app.post("/success", function (req, res) {
    res.redirect("/");
});

//failure post
app.post("/failure", function (req, res) {
    res.redirect("/");
});

// starting server (dynamic port)
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started ");
});
