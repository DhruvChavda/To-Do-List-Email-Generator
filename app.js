const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const {google} = require("googleapis");
const _ = require("lodash");
const { result } = require("lodash");

const app = express();

// google APIs setup
const CLIENT_ID ='523233734671-4e4hbj9ga8o1ft8diuup2saa9vod14b9.apps.googleusercontent.com';
const CLIENT_SECRET ='o6qA5VY5XcKusqNR2Q6aHTjR';
const REDIRECT_URL ='https://developers.google.com/oauthplayground';
const REFRESH_TOKEN ='1//045kumIM7BobFCgYIARAAGAQSNwF-L9Ir0enV5W1ZwNWcQj1AG9h6aLrtjAmhgeejMZ2vIWIzJnmOWuBGZIQeKkMgh0l2oVc4ghg';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

//bodyParser
app.use(bodyParser.urlencoded({extended:true}));

//static 
app.use(express.static("public"));

// GET
app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/index.html");
});


// POST
app.post("/", (req, res)=>{
    // console.log(req.body);
    const userEmail = req.body.email;
    const userNick = _.capitalize(req.body.nname)
    const userName = req.body.fname;

    // async function sendMail(){
    //   try{
    //     const accessToken = await oAuth2Client.getAccessToken();
    //     // create reusable transporter object using the default SMTP transport
    //     let transporter = nodemailer.createTransport({
    //       service: 'gmail',
    //       auth: {
    //         type: 'OAuth2',
    //         user: '2fpsgames@gmail.com', // generated gmail user
    //         // pass: 'lagg_vro', // generated gmail password
    //         clientId: CLIENT_ID,
    //         clientSecret: clientSecret,
    //         refreshToken: REFRESH_TOKEN,
    //         accessToken: accessToken
    //       }
    //     });

const url = "https://evening-mesa-84597.herokuapp.com/" + userNick;
const encodedUrl = encodeURI(url);

let message = `Hello! ${userName}

Here's the link to your personal to-do list:

${encodedUrl}

This Link will automatically save your notes and you can open it from anywhere/ anydevice with ease. So star it, save it, bookmark it - its yours! 

So open it on laptop or mobile, it will automatically sync all your data!

If you find any issues using this list, you can always reply to this message.

Have fun!
DMC`

        // let mailOptions = {
        //   from: '"To Do List! 📜" <2fpsgames@gmail.com>', // sender address
        //   to: userEmail, // list of receivers
        //   subject: "Here's Your Link", // Subject line
        //   text: message, // plain text body
        //   // html: '<a href="https://dhruvchavda.github.io/me/">DMC</a>', // html body
        // };

    //     // send mail with defined transport object
    //     let info = await transporter.sendMail(mailOptions)      
    //     return info;

    //   } catch(err){
    //     return err;
    //   }
    // }

    // sendMail().then(x=>{
    //   console.log("Email sent");
    //   res.sendFile(__dirname+"/success.html");
    //   }).catch(err=>{
    //     console.log("Error Occured Email Not Sent");
    //     res.sendFile(__dirname+"/failure.html");
    //   });

    const AccessToken = oAuth2Client.getAccessToken();

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET
        }
    });
    
    transporter.sendMail({
        from: '"To Do List! 📜" <2fpsgames@gmail.com>', // sender address
        to: userEmail, // list of receivers
        subject: "Here's Your Link", // Subject line
        text: message,
        auth: {
            user: '2fpsgames@gmail.com',
            refreshToken: REFRESH_TOKEN,
            accessToken: AccessToken
        }
    }, (err, info)=>{
        if(err){
            console.log("Error Occured Email Not Sent");
            res.sendFile(__dirname+"/failure.html");
        }
        else
        {
            console.log("Email sent");
            res.sendFile(__dirname+"/success.html");
        }
    });
});

//success post
app.post("/success", function(req, res){
    res.redirect("/");
});

//failure post
app.post("/failure", function(req, res){
    res.redirect("/");
});


// starting server (dynamic port)
app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server started ");
});