

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

  app.get('/auth/facebook',passport.authenticate('facebook',{scope: 'email'}));
  app.get('/auth/facebook/callback',passport.authenticate('facebook',{
    successRedirect: '/dashboard',
    failureRedirect:'/login',
    failureFlash: true
  }));

  app.get('/connect/facebook',passport.authorize('facebook',{scope: 'email'}));
  app.get('/connect/facebok',passport.authorize('facebok',{
    successRedirect: '/dashboard',
    failureRedirect: '/dashboard',
    failureFlash: true
  }));

  app.get('/auth/twitter',passport.authenticate('twitter'));
  app.get('/auth/twitter',passport.authenticate('twiiter',{
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  }));


  function isAuthenticated(req , res , next){
    if(req.isAuthenticated())
        return next();
    res.redirect('/');
  }

};
