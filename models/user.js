var Model = require('./base.js');

module.exports = function(store) {
  return new Model(store, { database: 'expense', collection: 'users' }, {
    id: { type: 'string' },
    organizationId: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string' },
    role: { type: 'string' },
    invitedBy: { type: 'string' }
  });
};
