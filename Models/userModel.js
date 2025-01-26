const mongoose =require('mongoose')

const userSchema = mongoose.Schema({
name:String,
email:String,
mobileNo:Number,
password:String
})

const User =  mongoose.model('users', userSchema)

module.exports = {User}