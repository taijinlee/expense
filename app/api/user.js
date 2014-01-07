
module.exports = function(app, store) {
  var user = require(process.env.APP_ROOT + '/handlers/user.js')(store);

  app.post('/user', function(req, res, next) {
    user.create(req.body, res.locals.responder);
  });

  /*
  app.post('/user/signup', middlewares.entity.notExists('user', 'email', 'email'), function(req, res, next) {
    var signupData = req.body;
    handlers.user.signup(signupData.email, signupData.name, signupData.secret, signupData.fianceName, res.locals.responder.send);
  });

  app.get('/user/:userId', middlewares.entity.exists('user'), function(req, res, next) {
    handlers.user.retrieve(res.locals.auth.tokenUserId, req.params.userId, res.locals.responder.send);
  });

  app.put('/user/:userId', middlewares.auth.requireLogin, middlewares.entity.exists('user'), function(req, res, next) {
    var updateData = req.body;
    handlers.user.update(res.locals.auth.tokenUserId, req.params.userId, updateData, res.locals.responder.send);
  });

  app.del('/user/:userId', middlewares.auth.requireLogin, middlewares.entity.exists('user'), function(req, res, next) {
    handlers.user.destroy(res.locals.auth.tokenUserId, req.params.userId, res.locals.responder.send);
  });

  app.get('/users', function(req, res, next) {
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
*/

};
