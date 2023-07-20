const express = require('express')
const mongoose = require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
require('dotenv').config()

const UserSchema=new mongoose.Schema({
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true,
    // minLength:[5,"Enter only 5 character"]
},
confirmpassword:{
    type:String,
    required:true
},
Date:{
    type:Date,
    default :Date.now
},
tokens:[{
     token:{
      type:String,
      required:true
     }
}]

})
//jwt TOKEN
UserSchema.methods.GenerateToken=async function(){
    try {
      const token=jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY)
      this.tokens=this.tokens.concat({token:token})
     await this.save()
     return token
    } catch (error) {
        console.log(error +"in jwt")
    }
}


//bcrypt hash
UserSchema.pre('save',async function(next){
if (this.isModified('password')) {
    
    this.password=await bcrypt.hash(this.password,10)
    this.confirmpassword=await bcrypt.hash(this.confirmpassword,10)
}
next()

})
const User=mongoose.model("User",UserSchema)
module.exports=User