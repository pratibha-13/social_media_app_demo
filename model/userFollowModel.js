const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var UserFollow = new Schema({
    sender_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    receiver_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    status: {
        type: String,
        enum: ['1','2','3'],
    },//1 ) request , 2) accept ,3)block
}, { timestamps: true });

module.exports = mongoose.model("user_follows", UserFollow);