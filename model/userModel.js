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
        unique: true
    },
    // avatar: {
    //     type: String,
    //     default: "https://localhost:3000/user/male.png"
    // },
    profile_image: {
        type: String,
        default: "male.png"
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    user_status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    who_can_follow_me: {
        type: String,
        enum: ['0', '1','2'],//"Everyone", = 0 "No one", = 2 "By Approval" = 1
        default: '0'
    },
    hash : String,
    salt : String,
    token: String,

}, { timestamps: true });

// User.pre("save", true, function (next, done) {
//     var self = this;
//     mongoose.models["User"].findOne({ email: self.email }).then(data => {
//         if (data)
//         {
//             self.invalidate("email", "Email must be unique");
//             done(new Error("Email must be unique"));
//         } else {
//             done();
//         }
//       })
//       .catch((err)=>
//       {
//         done(err);
//       } );
//     next();
// });

User.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
};
User.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password,
    this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.hash === hash;
};
// Define a getter method for profileImage
User.path('profile_image').get(function (value) {
    // You can customize the logic here for getting the profileImage
    // For example, you might want to add a default image if none is provided
    return value || 'https://localhost:3000/auth/default_user.jpg';
});

// Define a setter method for profileImage
User.path('profile_image').set(function (value) {
    // You can customize the logic here for setting the profileImage
    // For example, you might want to validate the URL format or make it HTTPS
    return value.startsWith('http') ? value : 'https://localhost:3000/auth/uploads/profile/' + value;
});

module.exports = mongoose.model("users", User);