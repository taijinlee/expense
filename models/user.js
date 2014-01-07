var Model = require('./base.js');

module.exports = function(store) {
  return new Model(store, { database: 'expense', collection: 'users' }, {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' }
  });
};
