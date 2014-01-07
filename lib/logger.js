var logger = module.exports = {};

logger.serverLogFormat = function() {
  var format = {
    date: ':date',
    status: ':status',
    response_time: ':response-time',
    method: ':method',
    url: ':url',
    referrer: ':referrer',
    user_agent: ':user-agent',
    remote_addr: ':remote-addr',
    http_version: ':http-version',
    reqHeader: ':req',
    resHeader: ':res'
  };
  return JSON.stringify(format);
};

logger.serverLogFormatDev = function() {
  var format = {
    date: ':date',
    status: ':status',
    response_time: ':response-time',
    method: ':method',
    url: ':url',
    referrer: ':referrer',
    reqHeader: ':req',
    resHeader: ':res'
  };
  return JSON.stringify(format);
};

logger.error = function(error) {
  var format = {
    message: error.message,
    stack: error.stack
  };
  logger.log(format);
};

logger.log = function(obj) {
  console.log(JSON.stringify(obj));
};
