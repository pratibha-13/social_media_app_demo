let database = require('../config/database'),
jwt = require('jsonwebtoken');
let config = require('../config/config');
const User = require("../model/userModel");
var async = require("async");
require("dotenv").config();
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

const signUp = async (req, res) => {
  // console.log(req.body)
  // return
  try {
    // let newUser = new User();
    // newUser.userName = req.body.userName;
    // newUser.fullName = req.body.fullName;
    // newUser.email = req.body.email;
    // newUser.status = "active";
    // newUser.avatar = "https://localhost:3000/user/male.png";
    // newUser.profile_image = "male.png";
    // newUser.setPassword(req.body.password);

        // let imageLink = "http://localhost:3000";
        // if (req.headers.host == env.LIVE_HOST_USER_APP) {
        //     imageLink = env.LIVE_URL;
        // } else {
        //     imageLink = env.LOCAL_URL;
        // }
        var form = new formidable.IncomingForm();
        // form.multiples = true;
        form.uploadDir = path.join(__dirname, 'uploads/profile');
        form.parse(req, async function (err, fields, files) {
            if (err) return res.json({ status: 0, 'response': { msg: err } });
            let newUser = new User();
            if(files)
            {
                files.profilePic.forEach((file) => {
                    filename = Date.now() + '-' + file.originalFilename;
                    const newFilepath = `${path.join(__dirname, 'uploads/profile')}/${filename}`;
                    fs.rename(file.filepath, newFilepath,function (err) { });
                    newUser.profile_image = filename;
                  });
            }
            if(fields.userName[0] != null)
            {
                // const { userName} = fields.userName[0];
                // let UserName = await User.findOne({ userName });
                // if (UserName) {
                //     return res.status(400).send({success: 0,msg: "UserName already exists.",});
                //   }else{
                    newUser.userName = fields.userName[0];
                //   }
            }else
            {
                res.status(400).json({success: 0,msg: "Username required.",});
            }
            if(fields.fullName[0] != null)
            {
                newUser.fullName = fields.fullName[0];
            }else
            {
                res.status(400).json({success: 0,msg: "FullName required.",});
            }
            if(fields.email[0] != null)
            {
                // const { email} = fields.email[0];
                // let Email = await User.findOne({ email });
                // if (Email) {
                //     return res.status(400).send({success: 0,msg: "Email already exists.",});
                //   }else{
                    newUser.email = fields.email[0];
                //   }
            }else
            {
                res.status(400).json({success: 0,msg: "Email required.",});
            }
            newUser.status = "active";
            newUser.setPassword((fields.password[0]).toString());
            let user = newUser.save()
            if(!user){
                res.status(400).json({
                    success: 0,
                    msg: "Failed to add user.",
                });
            }else {
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
      if (user.validPassword(req.body.password)) {
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
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const getAuthUser = async (req, res) => {
    try {
      let user = req.user;
      if (!user) {
        return res.json({ success: 0, data: {}, msg: 'User not found.' });
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

module.exports = {
  signUp,
  login,
  getAuthUser
};
