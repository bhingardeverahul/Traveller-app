const express = require('express')
const mongoose = require('mongoose')


const TaskSchema=new mongoose.Schema({
name:{
    type:String,
    required:true
},


task:{
    type:String,
    required:true
},
message:{
    type:String,
    required:true
},
Date:{
    type:Date,
    default :Date.now
},
})


const Task=mongoose.model("Task",TaskSchema)
module.exports=Task