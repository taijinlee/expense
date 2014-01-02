var _ = require('underscore');
var async = require('async');

module.exports = function(app, store) {
  var authModel = require(process.env.APP_ROOT + '/models/auth.js')(store);
  var userModel = require(process.env.APP_ROOT + '/models/user.js')(store);
  var tokenizer = require(process.env.APP_ROOT + '/lib/tokenizer.js');

  app.post('/api/user', function(req, res, next) {
    var userData = {
      id: store.generateId(),
      email: req.body.email,
      name: req.body.name,
      role: 'admin'
    };

    var authData = {
      id: store.generateId(),
      userId: userData.id,
      type: 'base',
      identifier: userData.email
    };
    authData.salt = tokenizer.generateSalt();
    authData.secret = tokenizer.generate(authData.salt, secret, 0, 0);

    async.auto({
      user: function(done) { userModel.insert(userData, done); },
      auth: function(done) { authModel.insert(authData, done); },
    });
  });

  app.post('/api/user/signup', middlewares.entity.notExists('user', 'email', 'email'), function(req, res, next) {
    var signupData = req.body;
    handlers.user.signup(signupData.email, signupData.name, signupData.secret, signupData.fianceName, res.locals.responder.send);
  });

  app.get('/api/user/:userId', middlewares.entity.exists('user'), function(req, res, next) {
    handlers.user.retrieve(res.locals.auth.tokenUserId, req.params.userId, res.locals.responder.send);
  });

  app.put('/api/user/:userId', middlewares.auth.requireLogin, middlewares.entity.exists('user'), function(req, res, next) {
    var updateData = req.body;
    handlers.user.update(res.locals.auth.tokenUserId, req.params.userId, updateData, res.locals.responder.send);
  });

  app.del('/api/user/:userId', middlewares.auth.requireLogin, middlewares.entity.exists('user'), function(req, res, next) {
    handlers.user.destroy(res.locals.auth.tokenUserId, req.params.userId, res.locals.responder.send);
  });

  app.get('/api/users', function(req, res, next) {
    var page = req.param('page', 1);

    var limit = 10;
    var skip = (page - 1) * limit;

    var filters = req.query;
    delete filters.page;
    if (filters.keywords) {
      filters.$and = _.chain(filters.keywords.split('+'))
        .map(function(keyword) { return keyword ? { keywords: { $regex: '^' + keyword } } : null; })
        .compact()
        .value();
    }
    delete filters.keywords;

    handlers.user.list(filters, limit, skip, res.locals.responder.send);
  });

};
