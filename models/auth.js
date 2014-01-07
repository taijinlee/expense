var Model = require('./base.js');

module.exports = function(store) {
  return new Model(store, { database: 'expense', collection: 'auths' }, {
    id: { type: 'string' },
    userId: { type: 'string' },
    type: { type: 'string' },
    secret: { type: 'string' },
    identifier: { type: 'string' },
    salt: { type: 'string' }
  });
};
