var async = require('async');
var authConfig = require('config').auth;
var tokenizer = require(process.env.APP_ROOT + '/lib/tokenizer.js');

module.exports = function(store) {
  var AuthModel = require(process.env.APP_ROOT + '/models/auth.js')(store);
  var UserModel = require(process.env.APP_ROOT + '/models/user.js')(store);

  var authMiddleware = {};

  authMiddleware.getTokenUserId = function(req, res, next) {
    res.locals.auth = { tokenUserId: false };

    var loginToken = req.cookies.login;
    if (!loginToken) { return next(null); }

    var userId = loginToken.slice(0, loginToken.indexOf(':'));
    var tokenParts = loginToken.split(':');
    tokenParts.unshift(authConfig.salt);

    if (tokenizer.match.apply(null, tokenParts)) { res.locals.auth.tokenUserId = userId; }
    return next(null);
  };

  // requires getTokenUserId to run before it
  authMiddleware.requireLogin = function(req, res, next) {
    if (res.locals.auth.tokenUserId === false) { return next(new Error('unauthorized: require login')); }
    return next(null);
  };

  // requires getTokenUserId to run before it
  authMiddleware.requireLogout = function(req, res, next) {
    if (res.locals.auth.tokenUserId !== false) { return next(new Error('unauthorized: require logout')); }
    return next(null);
  };

  authMiddleware.isRole = function(role) {
    return function(req, res, next) {
      async.series([
        async.apply(authMiddleware.requireLogin, req, res),
        function(done) {
          var user = new UserModel({ id: res.locals.auth.tokenUserId });
          user.retrieve(function(error, userData) {
            if (error) { return next(error); }
            if (userData.role !== role) { return next(new Error('unauthorized')); }
            return done(null);
          });
        }
      ], function(error) {
        next(error);
      });
    };
  };

  authMiddleware.login = function(req, res, next) {
    async.auto({
      authData: function(done, results) {
        new AuthModel({ identifier: req.body.identifier, type: 'base' }).retrieve(done);
      },
      authenticate: ['authData', function(done, results) {
        var authData = results.authData;
        if (!authData || !tokenizer.match(authData.salt, req.body.secret, 0, 0, authData.secret)) {
          return done(new Error('unauthorized: incorrect password'));
        }

        var userId = authData.userId;
        // give the user a good login cookie
        var time = (new Date()).getTime();
        var token = tokenizer.generate(authConfig.salt, userId, time, 300000 /* 5 mins */);

        res.cookie('userId', userId);
        res.cookie('login', [userId, time, 300000, token].join(':'))
        return done(null);
      }]
    }, next);
  };

  authMiddleware.logout = function(req, res, next) {
    res.clearCookie('userId');
    res.clearCookie('login');
    return next();
  };

  return authMiddleware;
};
