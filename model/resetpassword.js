var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var moment = require('moment');

var resetPasswordSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reset_token: {
        type: String,
        trim: true,
        required: true
    },
    expired_at: {
        type: Date,
        default: moment().add(2, 'hour')
    },
    salt: String
}, {
    timestamp: true
});

resetPasswordSchema.methods.generateResetToken = function () {
    this.salt = crypto.randomBytes(32).toString('hex');
    this.reset_token = crypto.pbkdf2Sync('reset', this.salt, 1000, 64, 'sha512').toString('hex');
}

module.exports = mongoose.model('ResetPassword', resetPasswordSchema);
