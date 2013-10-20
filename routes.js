var passport = require('passport'),
  UserModel = require('./model/user.js'),
  api = require("./api.js");

module.exports = function (app) {

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
  }

  app.get('/', ensureAuthenticated, function (req, res) {
    res.cookie("userName", req.user.username);
    res.cookie("userId", req.user._id);
    res.render('index', {
      user: req.user
    });
  });

  app.get('/register', function(req, res) {
    res.render('register', {});
  });

  app.post('/register', function(req, res) {
    req.assert('username', 'Username is required').notEmpty();
    req.assert('password', 'Password is too short').len(6, 20);
    req.assert('password', 'Passwords do not match').equals(req.body.password_confirmation);

    var errors = req.validationErrors();

    if (!errors){
      UserModel.register(new UserModel({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
          return res.render('register', { user : account });
        }
        res.redirect('/');
      });
    } else {
      res.render('register', {
        message: '',
        errors: errors
      });
    }
  });

  app.get('/login', function(req, res) {
    res.render('login', {});
  });

  app.post('/login', passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true
    })
  );

  app.get('/logout', function(req, res) {
    res.clearCookie('userName');
    res.clearCookie('userId');
    req.logout();
    res.redirect('/');
  });

  // API
  app.get('/chat', function (req, res) {
    res.send('Chat is running');
  });
  app.get('/chat/message', api.getMessages);
  app.post('/chat/message', api.postMessage);
  // app.get('/api/notes/:id', api.getNote);
  // app.put('/api/notes/:id', api.updateNote);
  // app.delete('/api/notes/:id', api.deleteNote);

};