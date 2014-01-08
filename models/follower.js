var Model = require('./base.js');

module.exports = function(store) {
  return new Model(store, { database: 'expense', collection: 'followers' }, {
    id: { type: 'string' },
    userId: { type: 'string' },
    followingUserId: { type: 'string' }
  });
};
