const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const User = require("../models/userSchema");
const Task=require('../models/taskSchema')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const auth=require('../middleware/auth')
require('dotenv').config()
require("../db/connects");
const path = require("path");
var cookieParser = require("cookie-parser");
const nodemailer=require('nodemailer')
//view engine

const files = path.join(__dirname, "../views");
app.set("view engine", "ejs");
app.set("views", files);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/",(req, res) => {
  res.render("home");
});
app.get("/home",(req, res) => {
  res.render("home");
});
app.get("/profile",auth ,(req, res) => {
  res.render("profile");
});
app.post("/profile",async (req, res) => {
  // res.render("profile");
  try {
    
    const name=req.body.name
    const task=req.body.task
    const message=req.body.message
    const RegTask= new Task({
      name:req.body.name,
      task:req.body.task,
      message:req.body.message
    }) 
    
    const data=await RegTask.save()
    // console.log(data)
    res.render('home')
  } catch (error) {
   console.log(error) 
  }
    
  });
app.get("/logout", (req, res) => {
    res.clearCookie("jwt","null",{
        maxAge:1
    })
    res.render("login");
});


//signup
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.post("/signup", async (req, res) => {
  try {
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;
    if (password === confirmpassword) {
      const register = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
      });
      console.log("The start is: "+register)
    
    const registertoken=await register.GenerateToken()
     console.log("the register :"+ registertoken)
    
     //token send to cookies
     res.cookie('jwt',registertoken,{
        expires:new Date(Date.now()+30000),
        httpOnly:true
     })

      const Regsave = await register.save();
      console.log(Regsave);
 

      res.render("profile");
    }
    
  } catch (error) {
    // res.status(400).json({
    //   error: "invalid password",
    // }); 
    res.render('error')
  }
});


//login 
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", async(req, res) => {
  try {
    const email=req.body.email
    const password=req.body.password
    
    const loginData= await User.findOne({email:email})
    const isMatch=await bcrypt.compare(password,loginData.password)
    console.log(isMatch) 
    
    const verifytoken=await loginData.GenerateToken()
    console.log(verifytoken)
    
    res.cookie('jwt',verifytoken,{
      expires:new Date(Date.now()+30000),
      httpOnly:true
    })
    
    if(isMatch){
      res.render("home")
    }
  } catch (error) {
    res.status(400).json({
        error: "invalid password",
      }); 
    // res.render('error')
  }

});

//use nodemail 
//email send for forget password send
const sendmailUser=async(name,email,token)=>{
  try {
    // create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",   
      port: 587,
      secure: false,
      requireTLS:true,
      auth: {
        // generated ethereal user// generated ethereal password
        user: 'rahulbhingardeve744@gmail.com',
        pass: 'qsjngqdiabltuygt'
      },
    });
  const mailOption=({
from: 'rahulbhingardeve744@gmail.com',
to: email,
subject: "Reset Password",
html: "<p>Hi " + name + "please, reset password <a href='http://localhost:5000/reset?token="+token+"'> reset password </a>  </p>", // html body
   });
transporter.sendMail(mailOption,function (error,info) {
if (error) {
  res.render('reset')
} else {
  console.log("Message sent: %s", info.res);
  // res.send("Message sent: %s", info.res)
  res.render('reset')
}

})

} catch (error) {
console.log(error)
// res.status(400).send({success:false,message:"invalid error reset password"})
res.render('reset')
}
}


//forget password 
app.get("/forget", (req, res) => {
  res.render("forget");
});

app.post("/forget", async(req, res) => {
try {
const email=req.body.email

const upadatePass= await User.findOne({email:email})
if(upadatePass){
  const tokenString=await upadatePass.GenerateToken()
const findEmail=await User.updateOne({email:email},{$set:{
 token:tokenString
}}) 

sendmailUser(upadatePass.name,upadatePass.email,tokenString)
res.render('reset')

}

} catch (error) {
  console.log(error)
}

});


//reset password
app.get("/reset",(req, res) => {
  res.render("reset");
});

//rreset password
app.post("/reset",async(req, res) => {
  const reset_Pass=async(req,res)=>{
    try {
    const tokenData=await User.findOne({token:res.cookie.jwt})
    if (tokenData) { 
      const password=req.body.password
      //user hash passwprd
  // const newPassword = await SecurePswd(password);
  
  const a= await User.findByIdAndUpdate({_id:tokenData._id},{$set:{
    password:password,
  }},{new:true})
  
  res.render("login");

}else{
  res.render("error");
}
} catch (error) {
  console.log(error)
  res.render("error");
  
  }
}

});



app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
