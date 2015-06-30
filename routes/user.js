

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

  app.post('/signup',passport.authenticate('signup',{
    successRedirect: '/login',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.get('/connect/local',isAuthenticated,function (req,res) {
    res.render('local-connect',{message : req.flash('connectlocal')});
  });

  app.post('/connect/local',passport.authenticate('signup',{
    successRedirect : '/dashboard',
    failureRedirect: '/connect/local',
    failureFlash: true
  }));

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

  app.get('/unlink/facebook',function(req,res){
     var user = req.user;
     user.facebook.token = undefined;
     user.save(function(error){
       res.redirect('/dashboard');
     });
  });

  app.get('/unlink/local',function(req, res){
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function(error){
      if(error)
        res.render('/dashboard',{message : req.flash(
          'dashboard','Não foi possivel realizar, tente novamente mais tarde')});
      res.redirect('/dashboard');
    });
  });

  app.get('/dashboard',isAuthenticated,function(req, res){
    res.render('dashboard',{user: req.user});
  });

  app.get('/logout',function(req, res){
    req.logout();
    res.redirect('/');
  });

  function isAuthenticated(req , res , next){
    if(req.isAuthenticated())
        return next();
    res.redirect('/');
  }

};
