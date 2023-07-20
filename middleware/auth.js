const User=require('../models/userSchema')
const jwt=require('jsonwebtoken')
require('dotenv').config()
const auth=async(req,res,next)=>{
 try {
  const token=res.cookies.jwt
  const verifyToken= jwt.verify(token, process.env.SECRET_KEY)
  console.log(verifyToken)
  const user=await User.findOne({_id:verifyToken._id})
  req.user=user
  req.token=token
  next()
 } catch (error) {
   console.log(error) 
 }
}
module.exports=auth