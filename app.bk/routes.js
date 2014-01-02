var wrench = require('wrench');
var fs = require('fs');
var _ = require('underscore');

module.exports = function(app, store) {
  // load all api routes
  var routeFiles = wrench.readdirSyncRecursive(process.env.APP_ROOT + '/app/routes');
  _.each(routeFiles, function(file) {
    require(process.env.APP_ROOT + '/app/routes/' + file)(app, store);
  });

  app.all('/api/*', function(req, res, next) {
    // if an api request falls through, then let's not let it fall through to catch all
    var error = new Error('Invalid request');
    error.code = 404;
    return next(error);
  });

  // capturing non-api request routes
  app.all('*', function(req, res, next) {
    var layout = process.env.APP_ROOT + process.env.WEB_ROOT + (process.env.GIT_REV !== undefined ? '/' + process.env.GIT_REV : '') + '/layout.html';
    var html = fs.readFileSync(layout, 'utf8');
    res.end(html);
    return; // breaking here for now

    var jsdom = require('jsdom');
    var markup = fs.readFileSync(process.env.WEB_ROOT + '/layout.html', 'utf8');

    jsdom.env({
      html: markup,
      url: 'http://localhost:3000/',
      features: {
        FetchExternalResources   : ['script'],
        ProcessExternalResources : ['script'],
        MutationEvents           : '2.0',
        QuerySelector            : false
      },
      done: function(errors, window) {
        window.location.pathname = req.url;
        window.location.search = '';
        window.location.hash = '';

        var html = window.document.innerHTML;
        res.end(html);
      }
    });
  });
};
