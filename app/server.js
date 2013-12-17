
if (process.env.NODE_ENV === undefined) { throw new Error('NODE_ENV not set. Try \'prod\' or \'dev\'.'); }
if (process.env.APP_ROOT === undefined) { throw new Error('APP_ROOT not set. Try ~/expense or /service/expense'); }

var express = require('express');
var config = require('config');
var logger = require(process.env.APP_ROOT + '/lib/logger.js')();
var app = express();
var server = require('http').createServer(app);

// overwriting default date token definition
express.logger.token('date', function() { return Date().replace(/GMT-\d{4} /, ''); });

app.configure(function() {
  app.use(express.compress());
  app.use(express.bodyParser({ uploadDir: process.env.APP_ROOT + '/tmp' }));
  app.use(express.cookieParser());
  // use this as _method = POST / PUT / DELETE in forms to emulate them without going through backbone
  app.use(express.methodOverride());
});

// services
var datastore = 'mysql';
var store = require(process.env.APP_ROOT + '/store/store.js')(datastore, config.store.mongo);

// load config based on environment
// specific to development
app.configure('dev', function () {
  process.env.WEB_ROOT = '/web';

  app.use(express.logger(logger.serverLogFormatDev()));
  app.use(function(req, res, next) {
    // filter out VERSION placeholder on dev
    if (req.url.indexOf('VERSION') !== -1) { req.url = req.url.replace(/VERSION\//, ''); }
    return next();
  });
  app.use(express['static'](process.env.APP_ROOT + process.env.WEB_ROOT));
});

// specific to production
app.configure('prod', function () {
  process.env.WEB_ROOT = '/web-build';

  app.use(express.logger(logger.serverLogFormat()));
  app.use(express['static'](process.env.APP_ROOT + process.env.WEB_ROOT, {
    maxAge: 31536000000 // one year
  }));
});

// globally applied middleware
var authMiddleware = require(process.env.APP_ROOT + '/app/middleware/auth.js')(store);
// finisher for all environments
app.configure(function() {
  app.use(function(req, res, next) {
    res.locals.responder = require(process.env.APP_ROOT + '/lib/responder.js')();
    res.locals.responder.initialize(res);
    return next();
  });

  app.use(authMiddleware.getTokenUserId);
  app.use(app.router);
  app.use(function(error, req, res, next) { res.locals.responder.send(error); });
});

// load routes
require(process.env.APP_ROOT + '/app/routes.js')(app, store);
// start listening
server.listen(config.app.port);

logger.log({ message: 'server start', port: config.app.port });
