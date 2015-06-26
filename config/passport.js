
var LocalStrategy = require('passport-local');
var User = require('../model/user');

module.exports = function(passport){

  passport.serializeUser(function(user,done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id,function(error, user){
        done(error, user);
    });
  });

  passport.use('local-signup',
    new LocalStrategy({
      userNameField: 'email',
      passwordField: 'password',
      passReqToCallback: true

    },function(req, email,password,  done){
      process.nextTick(function(){
        User.findOne({'local.email': email},function(error, user){
          if(error) return done(error);
          if(user){
              return done(null, false, req.flash('singupmessage', 'This email already exists'));
          }else{
            var newUser = new User();
            newUser.local.email = req.body.email;
            user.local.password = user.generateHash(req.body.password);
            newUser.save(function(error){
              if(error)
                throw error;
              return done(null, newUser);
            });
          }
        });
      });
    }
    )
  );


}
