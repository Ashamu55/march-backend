const mongoose = require('mongoose');
// require ('dotenv').config
// let uri = process.env.URI;
// 
// 
// mongoose.connect(uri)

UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: { type: String, require: true },
})

const userModel = mongoose.model('userModel', UserSchema)

module.exports = userModel;