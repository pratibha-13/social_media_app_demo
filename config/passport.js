let JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
let User = require('../model/userModel');
let config = require('../config/database'); // get db config file

module.exports =  function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    User.findOne({_id: jwt_payload._id}).then(data => {
        if (data)
        {
            done(null, data);
        } else {
            done(null, false);
        }
      })
      .catch((err)=>
      {
        return done(err, false);
      }
      );
  }));
};
