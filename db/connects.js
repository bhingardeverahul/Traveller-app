const mongoose = require('mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/SIGNUP_DATA").then(()=>{
    console.log("MongoDB is connected Successfully......")
}).catch(()=>{
    console.log("Error connecting to database")
})
