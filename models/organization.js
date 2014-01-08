var Model = require('./base.js');

module.exports = function(store) {
  return new Model(store, { database: 'expense', collection: 'organizations' }, {
    id: { type: 'string' },
    name: { type: 'string' },
    domain: { type: 'string' }
  });
};
