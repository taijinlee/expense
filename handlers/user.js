var _ = require('underscore');
var async = require('async');
var tokenizer = require(process.env.APP_ROOT + '/lib/tokenizer.js');

module.exports = function(store) {
  var authModel = require(process.env.APP_ROOT + '/models/auth.js')(store);
  var userModel = require(process.env.APP_ROOT + '/models/user.js')(store);

  var user = {};
  user.create = function(data, done) {
    var orgData = {
      id: store.generateId(),
      name: '',
      domain: ''
    };

    var userData = {
      id: store.generateId(),
      organizationId: orgData.id,
      email: data.email,
      name: data.name,
      role: 'orgAdmin',
      invitedBy: ''
    };

    var authData = {
      id: store.generateId(),
      userId: userData.id,
      type: 'base',
      identifier: userData.email
    };
    authData.salt = tokenizer.generateSalt();
    authData.secret = tokenizer.generate(authData.salt, data.secret, 0, 0);

    async.auto({
      user: function(done) { userModel.insert(userData, done); },
      auth: function(done) { authModel.insert(authData, done); }
    }, function(error) {
      if (error) { return done(error); }
      done(null, userData.id);
    });
  };

  user.retrieve = function(userId, done) {
    userModel.retrieve({ id: userId }, done);
  };

  return user;
};
