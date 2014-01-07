var logger = require(process.env.APP_ROOT + '/lib/logger.js');
var httpCodeMap = {
  invalid: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  server: 500,
};

var responder = module.exports = function(expressResponse) {
  var res = expressResponse;

  return (function(error, data) {
    var response = { message: 'ok', code: 200, data: data };

    if (error) {
      var codeMessage = error.message ? error.message.split(':') : [];
      response.message = codeMessage[1] || '';

      var errorCode = codeMessage[0] || '';
      response.code = httpCodeMap[errorCode];
      if (!response.code) {
        logger.error(new Error('invalid error code'));
        response.code = 500;
      }

      logger.error(error);
    }
    return res.send(response.code, JSON.stringify(response));
  });
};
