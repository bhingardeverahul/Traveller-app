const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://rrbb95361:qJ6iOx5O9LjASALN@imgsaver.zzryt95.mongodb.net/travel").then(()=>{
    console.log("MongoDB is connected Successfully......")
}).catch(()=>{
    console.log("Error connecting to database")
})
