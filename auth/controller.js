let database = require("../config/database"),
  jwt = require("jsonwebtoken");
let config = require("../config/config");
const User = require("../model/userModel");
var async = require("async");
require("dotenv").config();
var formidable = require("formidable");
var path = require("path");
var fs = require("fs");
let ResetPassword = require("../model/resetpassword");

const signUp = async (req, res) => {
  try {
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, "uploads/profile");
    form.parse(req, async function (err, fields, files) {
      if (err) return res.json({ status: 0, response: { msg: err } });

      if (!fields.userName[0]) {
        res.status(400).json({ success: 0, msg: "Username required." });
      } else {
        let userName = fields.userName[0];
        let UserName = await User.findOne({ userName: userName });
        if (UserName) {
          return res
            .status(400)
            .send({ success: 0, msg: "UserName already exists." });
        }
      }
      if (!fields.email[0]) {
        res.status(400).json({ success: 0, msg: "Email required." });
      } else {
        let email = fields.email[0];
        let Email = await User.findOne({ email: email });
        if (Email) {
          return res
            .status(400)
            .send({ success: 0, msg: "Email already exists." });
        }
      }
      if (!fields.fullName[0]) {
        res.status(400).json({ success: 0, msg: "FullName required." });
      }
      let newUser = new User();
      if (files) {
        files.profilePic.forEach((file) => {
          filename = Date.now() + "-" + file.originalFilename;
          const newFilepath = `${path.join(
            __dirname,
            "uploads/profile"
          )}/${filename}`;
          fs.rename(file.filepath, newFilepath, function (err) {});
          newUser.profile_image = filename;
        });
      }
      newUser.userName = fields.userName[0];
      newUser.fullName = (fields.fullName[0])?fields.fullName[0]:'';
      newUser.email = fields.email[0];
      newUser.user_status = "active";
      newUser.who_can_follow_me = (fields.who_can_follow_me[0])?fields.who_can_follow_me[0]:'0';;
      newUser.setPassword(fields.password[0].toString());
      let user = await newUser.save();
      if (!user) {
        res.status(400).json({
          success: 0,
          msg: "Failed to add user.",
        });
      } else {
        let token = jwt.sign(newUser.toJSON(), database.secret);
        newUser.token = "JWT " + token;

        res.status(200).json({
          success: 1,
          data: newUser,
          msg: "Successful created new user.",
        });
      }
    });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.json({ success: 0, msg: "Email or username must be unique!" });
    } else {
      res.status(500).send(error);
    }
  }
};

const login = async (req, res) => {
  try {
    let user = await User.findOne({ userName: req.body.userName });
    if (user === null) {
      return res.status(400).send({
        message: "User not found.",
      });
    } else {
      if(user.user_status == 'inactive')
      {
        return res.status(400).send({
          message: "Your account is pending admin approval. Please wait.",
        });
      }else{
        if (user.validPassword(req.body.password)) {
          let token = jwt.sign(user.toJSON(), database.secret);
          user.token = "JWT " + token;
          res.status(200).json({
            success: 1,
            data: user,
            msg: "User logged in",
          });
        } else {
          return res.status(400).send({
            message: "invalid email or password",
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getAuthUser = async (req, res) => {
  try {
    let user = req.user;
    if (!user) {
      return res.json({ success: 0, data: {}, msg: "User not found." });
    } else {
      res.status(200).json({
        success: 1,
        data: user,
        msg: "User found.",
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

function validate_update_email(user_email, user_id) {
  let user_info = User.find({ email: user_email,"_id": { $ne: user_id } });
  if (user_info.length > 0) {
      return { success: 0, msg: "Email is already exist" }
  }
  return { success: 1 };
};

const editProfile = async (req, res) => {
  try {
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, "uploads/profile");
    form.parse(req, async function (err, fields, files) {
      if (err) return res.json({ status: 0, response: { msg: err } });
      if(!fields.id[0])
      {
        res.status(400).json({ success: 0, msg: "User id required." });
      }else
      {
        user_id = fields.id[0]
        let userData = await User.findById(user_id);
        let Email_validation = validate_update_email(userData.email, user_id);
        if (Email_validation.success){
        if (fields.fullName[0]) {
          userData.fullName = fields.fullName[0];
        }
        if (files) {
          files.profilePic.forEach((file) => {
            filename = Date.now() + "-" + file.originalFilename;
            const newFilepath = `${path.join(
              __dirname,
              "uploads/profile"
            )}/${filename}`;
            fs.rename(file.filepath, newFilepath, function (err) {});
            userData.profile_image = filename;
          });
        }
          let user = await userData.save();
          if (!user) {
            res.status(400).json({
              success: 0,
              msg: "Failed to update user.",
            });
          } else {
            res.status(200).json({
              success: 1,
              data: userData,
              msg: "Your profile has been edited successfully.",
            });
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.json({ success: 0, msg: "Email or username must be unique!" });
    } else {
      res.status(500).send(error);
    }
  }
};

const forgotPassword = async (req, res) => {
  try {
    let user = User.findOne({
        email: req.body.email
      });
              if (!user) {
                  return res.json({ success: 0, data: {}, msg: 'Email not found.' });
              } else {
                  var date = new Date();
                  date.setHours(date.getHours() + 2);
                  var resetPassword = new ResetPassword();
                  resetPassword.user_id = user._id;
                  resetPassword.expired_at = date;
                  resetPassword.generateResetToken();
                  resetPassword.save();
                  var resetPasswordLink = "";
                  console.log(config.portalUrl);
                  console.log("===========");
                  if (config.portalUrl == 'https://socialmedia.com') {
                      console.log("=====in======");
                      resetPasswordLink = config.portalUrl + "/public/reset-password/" + resetPassword.reset_token;
                  }else{
                      resetPasswordLink = config.portalUrl + "/reset-password/" + resetPassword.reset_token;
                  }
                  console.log(resetPasswordLink);
                  var email_send = emailTemplateService.sendEmail('forgot-password', { user }, user.email, resetPasswordLink)
                  return res.json({ success: 1,  msg: 'Password link sent on your email' });
              }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  signUp,
  login,
  getAuthUser,
  editProfile,
  forgotPassword
};
