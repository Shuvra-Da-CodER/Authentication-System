const mongoose=require('mongoose');
require('dotenv').config();
const process = require('process');

mongoose.connect(process.env.MONGODB_URI)

const userSchema=new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    age:Number
})

module.exports=mongoose.model('user',userSchema);