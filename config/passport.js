
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../model/user');
var Auth = require('./auth');

module.exports = function(passport){
  // Local login/logout business-----------------
  passport.serializeUser(function(user,done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id,function(error, user){
        done(error, user);
    });
  });


  passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,

  },function(req, email, password, done){
    process.nextTick(function(){
      User.findOne({'local.email'  : email}, function(error, user){
        if(error)
          return done(error);
        if(!user)
          return done(null, false, req.flash('loginMessage','usuario nao encontrado'));

        if(!user.validPassword(password))
            return done(null, false, req.flash('loginMessage','Dados de acesso incorretos'));
        else {
          return done(null, user);
        }
      });
    });
  }));

  passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },function (req,email,password,done) {
      process.nextTick(function(){
        User.findOne({'local.email' : email},function(error, existingUser){
            if(error)
              return done(error);
            if(existingUser)
              return done(null, false, req.flash('','Email já utilizado tente '
              +'outro, caso tenha esquecido sua senha recupere aqui <<'));

            if(req.user){
              var user = req.user;
              user.local.email = email;
              user.local.password = user.generateHash(password);
              user.save(function (error) {
                if(error)
                  throw error;
                return done(null, user);
              });
            }else{
              var newUser = new User();
              newUser.local.email  = email;
              newUser.local.password  = newUser.generateHash(password);
              newUser.save(function(error){
                if(error)
                  throw error;
                return done(null, newUser);
              });
            }
        });
      });
  }))
  //Facebook login/ logout
  passport.use(new FacebookStrategy({
    clientID: Auth.facebook.clientID,
    clientSecret: Auth.facebook.clientSecret,
    callbackURL: Auth.facebook.callbackURL,
    profileFields: ['id', 'name','picture.type(large)', 'emails', 'displayName', 'about', 'gender'],
    passReqToCallback: true
  },function(req, accessToken, refreshToken, profile, done){
      process.nextTick(function(){
          if(!req.user){
            User.findOne({'facebook.id': profile.id},function (error,user) {
              if(error)
                return done(error);

              if(!user){
                newUser = new User();
                newUser.facebook.id = profile.id;
                newUser.facebook.token = accessToken;
                newUser.facebook.email = profile.emails[0].value;
                newUser.facebook.picture = profile.photos[0].value;
                newUser.facebook.name = profile.name.givenName
                                      + ' '+profile.name.familyName;
                newUser.save(function (error) {
                  if(error)
                    throw error;
                  return done(null, newUser);
                });
              }else {
                return done(null,user);
              }
            });
          }else {
            var user = req.user;
            user.facebook.id = profile.id;
            user.facebook.token = accessToken;
            user.facebook.email = profile.emails[0].value;
            user.facebook.picture = profile.photos[0].value;
            user.facebook.name = profile.name.givenName+ ' ' + profile.name.familyName;

            user.save(function (error) {
              if(error)
                throw error;
              return done(null,user);
            });
          }
      });
  }));
}
