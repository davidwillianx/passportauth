
var LocalStrategy = require('passport-local').Strategy;
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

  passport.use('local-signup',new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true

      },function(req, email, password, done){

        process.nextTick(function(){
          User.findOne({'local.email': email},function(error, user){
            if(error) return done(error);
            if(user){
                return done(null, false, req.flash('signupmessage', 'This email already exists'));
            }else{
              var newUser = new User();
              newUser.local.email = req.body.email;
              newUser.local.password = newUser.generateHash(req.body.password);
              newUser.save(function(error){
                console.log(error);
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

  passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,

  },function(req, email, password, done){
    process.nextTick(function(){
      User.findOne({'local.email': req.body.email},function(error, user){
        if(error) done(error);
        else{
          //three context to achiev* user not found, is not the same password and also its everything ok with it

          if(!user)
            return done(
                null
                ,false
                ,req.flash('loginMessage','usuario nao encontrado,'+
                 '<a>clique aqui</a>  faca seu registro')
            );
          if(!user.validPassword(req.body.password))
              return done(
                null,
                false,
                req.flash('loginMessage','Dados de usuario nao condizem')
              );

          else return done(null,user);
        }
      });
    });
  }));


}
