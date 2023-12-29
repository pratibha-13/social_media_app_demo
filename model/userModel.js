const mongoose = require("mongoose");
const crypto = require('crypto');
var Schema = mongoose.Schema;
var User = new Schema({
    fullName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        // unique: true
    },
    avatar: {
        type: String,
        default: "https://localhost:3000/user/male.png"
    },
    profile_image: {
        type: String,
        default: "male.png"
    },
    email: {
        type: String,
        required: true,
        // unique: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    hash : String,
    salt : String,
    token: String,

}, { timestamps: true });

User.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
};
User.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password,
    this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.hash === hash;
};

module.exports = mongoose.model("users", User);