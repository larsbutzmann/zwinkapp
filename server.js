if(process.env.NODETIME_ACCOUNT_KEY) {
  require('nodetime').profile({
    accountKey: process.env.NODETIME_ACCOUNT_KEY,
    appName: 'zwinkapp'
  });
}

var application_root = __dirname,
    express = require("express"),
    expressValidator = require('express-validator'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    jade = require('jade'),
    http = require('http'),
    socketIo = require("socket.io"),
    LocalStrategy = require('passport-local').Strategy;

var app = express(),
  server = http.createServer(app),
  io = socketIo.listen(server);

// Configure server
app.configure(function() {
  app.set('views', __dirname + '/site/views');
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + '/site'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.locals.pretty = true;
  app.use(expressValidator());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  // app.use(express.logger());
  app.use(express.methodOverride());
  app.use(app.router);
  //Show all errors in development
  // app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

// MongoDB
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/zwink';

mongoose.connect(mongoUri, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + mongoUri + '. ' + err);
  } else {
    console.log ('Succeeded connection to: ' + mongoUri);
  }
});

var UserModel = require('./model/user.js');

// Setup authentification
passport.use(new LocalStrategy(UserModel.authenticate()));
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

// Setup routes
require("./routes")(app);

// Setup chat
require("./chat")(io);

function startKeepAlive() {
    setInterval(function() {
        var options = {
            host: 'zwinkapp.herokuapp.com',
            port: 80,
            path: '/'
        };
        http.get(options, function(res) {
            res.on('data', function(chunk) {
                try {
                    // optional logging... disable after it's working
                    // console.log("HEROKU RESPONSE: " + chunk);
                } catch (err) {
                    console.log(err.message);
                }
            });
        }).on('error', function(err) {
            console.log("Error: " + err.message);
        });
    }, 60 * 30 * 1000); // load every 30 minutes
}

startKeepAlive();

var port = process.env.PORT || 5000;
server.listen(port, function() {
  console.log("Listening on " + port);
});