const mongoose = require("mongoose");

const Role = new mongoose.Schema({
    name: {
        type: String,
        required: true
      },
      permission_template: {
        type: String,
        // required: true
      },
      description: {
        // type: String
      }
}, { timestamps: true });
module.exports = mongoose.model("role", Role);