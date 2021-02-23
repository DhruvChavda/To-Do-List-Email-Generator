const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const _ = require("lodash");

const app = express();

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
    console.log(req.body);
    const userEmail = req.body.email;
    const userNick = _.capitalize(req.body.nname)
    // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: '2fpsgames@gmail.com', // generated gmail user
      pass: 'lagg_vro', // generated gmail password
    },
    tls:{
        rejectUnauthorized: false
    },
  });

  let message = `Hello!

  Here's the link to your personal to-do list:
  
  https://evening-mesa-84597.herokuapp.com/${userNick}
  
  This Link will automatically save your notes and you can open it from anywhere/ anydevice with ease. So star it, save it, bookmark it - its yours! 

  So open it on laptop or mobile, it will automatically sync all your data!

  If you find any issues using this list, you can always reply to this message.
  
  Have fun!
  DMC`

  let mailOptions = {
    from: '"To Do List! 📜" <2fpsgames@gmail.com>', // sender address
    to: userEmail, // list of receivers
    subject: "Here's Your Link", // Subject line
    text: message, // plain text body
    // html: '<a href="https://dhruvchavda.github.io/me/">DMC</a>', // html body
  };

  // send mail with defined transport object
  let info = transporter.sendMail(mailOptions,(err, info)=>{
    if(err)
    {
      res.sendFile(__dirname+"/failure.html");
    }
    res.sendFile(__dirname+"/success.html");
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