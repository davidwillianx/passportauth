

module.exports = function (app,passport) {

  app.get('/',function(req, res){
     res.render('login'
        ,{message : req.flash('loginMessage')}
      );
  });

  app.get('/login', function(req, res){
    res.render('login',{message: req.flash('loginMessage')});
  });

  app.post('/login',passport.authenticate('login',{
      successRedirect:'/dashboard',
      failureRedirect:'/login',
      failureFlash: true
  }));

  app.get('/signup',function(req, res){
    res.render('register.ejs', {message: req.flash('signupmessage')});
  });

  app.post('/signup',passport.authenticate('local-signup',{
    successRedirect: '/login',
    failureRedirect: '/signup',
    failureFlash: true,
    successFlash: true
  }));

  app.get('/dashboard',isAuthenticated,function(req, res){
    res.render('dashboard',{user: req.user});
  });

  app.get('/logout',function(req, res){
    req.logout();
    res.redirec('/');
  });


  function isAuthenticated(req , res , next){
    if(req.isAuthenticated())
        return next();
    res.redirect('/');
  }

};
