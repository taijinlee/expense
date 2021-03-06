
var sinon = require('sinon');
var should = require('should');
var _ = require('underscore');
var config = require('config').store;

var doTest = function(store, type) {
  describe('store:' + type, function() {
    var context = { database: 'test', collection: 'test' };

    var data = {
      id: store.generateId(),
      test: 'myTestObject'
    };
    var update = { test: 'myNewTestObject', blah: 'cool' };


    beforeEach(function(done) {
      // delete everything first
      store.destroy({}, context, function(error) {
        // insert the assumed stored data
        store.insert(data, context, done);
      });
    });


    describe('#insert', function() {
      it('should be able to create an object and immediately fetch it', function(done) {
        var _data = _.clone(data);
        _data.id = store.generateId();

        store.insert(_data, context, function(error) {
          should.not.exist(error);

          store.retrieve({ id: _data.id }, context, {}, /* options */ function(error, storedData) {
            should.not.exist(error);
            _.each(_.keys(_data), function(key) {
              storedData[key].should.eql(_data[key])
            });
            done();
          });
        });
      });

      it('should error on duplicate id key insert', function(done) {
        store.insert(data, context, function(error) {
          should.exist(error);
          done();
        });
      });
    });

    describe('#update', function() {
      it('should be able to update an object', function(done) {
        store.update({ id: data.id }, update, context, function(error) {
          should.not.exist(error);
          store.retrieve({ id: data.id }, context, {}, /* options */ function(error, storedData) {
            storedData.should.eql(_.extend(data, update));
            done();
          });
        });
      });
    });

    describe('#upsert', function() {
      it('should be able to update an object', function(done) {
        store.upsert({ id: data.id }, update, context, function(error) {
          should.not.exist(error);
          store.retrieve({ id: data.id }, context, {}, /* options */ function(error, storedData) {
            storedData.should.eql(_.extend(data, update));
            done();
          });
        });
      });

      it('should be able to insert an object', function(done) {
        var newId = store.generateId();
        store.upsert({ id: newId }, update, context, function(error) {
          should.not.exist(error);
          store.retrieve({ id: newId }, context, {}, /* options */ function(error, storedData) {
            storedData.should.eql(_.extend(data, update, {id: newId }));
            done();
          });
        });
      });
    });


    describe('#delete', function() {
      it('should be able to delete an object', function(done) {
        store.retrieve({ id: data.id }, context, {} /* options */, function(error, storedData) {
          should.not.exist(error);
          storedData.should.eql(data);

          store.destroy({ id: data.id }, context, function(error) {
            should.not.exist(error);
            store.retrieve({ id: data.id }, context, {} /* options */, function(error, storedData) {
              should.not.exist(error);
              should.not.exist(storedData);
              done();
            });
          });

        });
      });
    });
  });
};

_.each(['ram', 'mongo', 'mysql'], function(type) {
  var store = require(process.env.APP_ROOT + '/store/store.js')(type, config[type]);
  doTest(store, type);
});
