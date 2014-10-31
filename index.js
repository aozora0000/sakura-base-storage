(function() {
  var BaseStorage;

  BaseStorage = (function() {
    var AWS, path;

    AWS = require('aws-sdk');

    path = require('path');

    function BaseStorage(file) {
      AWS.config.loadFromPath(path.normalize(file));
      this.s3 = new AWS.S3();
    }

    BaseStorage.prototype.create_bucket = function(bucket, callback, params) {
      if (params == null) {
        params = {};
      }
      params = this.create_params(bucket, null, params);
      return this.head_bucket(bucket, (function(_this) {
        return function(err, data) {
          if ((err != null ? err.statusCode : void 0) === 404) {
            return _this.s3.createBucket(params, function(err, data) {
              console.log("create_bucket");
              return callback(err, data);
            });
          } else {
            return callback(err, data);
          }
        };
      })(this));
    };

    BaseStorage.prototype.delete_bucket = function(bucket, callback) {
      var params;
      params = this.create_params(bucket, null);
      return this.head_bucket(bucket, (function(_this) {
        return function(err, data) {
          if ((err != null ? err.statusCode : void 0) === 404) {
            return callback(null, data);
          } else if ((err != null ? err.statusCode : void 0) === 403) {
            return callback(err, data);
          } else if ((err != null ? err.statusCode : void 0) === 301) {
            return callback(err, data);
          } else {
            return _this.s3.deleteBucket(params, function(err, data) {
              console.log("delete_bucket");
              return callback(err, data);
            });
          }
        };
      })(this));
    };

    BaseStorage.prototype.delete_bucket_force = function(bucket, callback) {
      return this.head_bucket(bucket, (function(_this) {
        return function(err, data) {
          if ((err != null ? err.statusCode : void 0) === 404) {
            return callback(null, data);
          } else if ((err != null ? err.statusCode : void 0) === 403) {
            return callback(err, data);
          } else {
            return _this.list_objects(bucket, function(err, data) {
              var params;
              if (err) {
                return callback(err, data);
              } else {
                if (data.Contents.length !== 0) {
                  return _this.delete_objects(bucket, data.Contents, function(err, data) {
                    var params;
                    if (err) {
                      return callback(err, data);
                    } else {
                      params = _this.create_params(bucket, null);
                      return _this.s3.deleteBucket(params, function(err, data) {
                        console.log("delete_bucket_force");
                        return callback(err, data);
                      });
                    }
                  });
                } else {
                  params = _this.create_params(bucket, null);
                  return _this.s3.deleteBucket(params, function(err, data) {
                    console.log("delete_bucket_force");
                    return callback(err, data);
                  });
                }
              }
            });
          }
        };
      })(this));
    };

    BaseStorage.prototype.delete_object = function(bucket, key, callback) {
      var params;
      params = this.create_params(bucket, key);
      return this.head_object(bucket, key, (function(_this) {
        return function(err, data) {
          if ((err != null ? err.statusCode : void 0) === 404) {
            return callback(null, data);
          } else if ((err != null ? err.statusCode : void 0) === 403) {
            return callback(err, data);
          } else {
            return _this.s3.deleteObject(params, function(err, data) {
              console.log("delete_object");
              return callback(err, data);
            });
          }
        };
      })(this));
    };

    BaseStorage.prototype.delete_objects = function(bucket, deletes, callback, params) {
      var key, keys, _i, _len;
      if (params == null) {
        params = {};
      }
      params = this.create_params(bucket, null, params);
      keys = [];
      for (_i = 0, _len = deletes.length; _i < _len; _i++) {
        key = deletes[_i];
        keys.push({
          Key: key.Key
        });
      }
      params.Delete = {
        Objects: keys
      };
      return this.s3.deleteObjects(params, function(err, data) {
        console.log("delete_objects");
        return callback(err, data);
      });
    };

    BaseStorage.prototype.getBucketVersioning = function(bucket, callback) {
      var params;
      params = this.create_params(bucket, null);
      return this.s3.getBucketVersioning(params, (function(_this) {
        return function(err, data) {
          console.log("getBucketVersioning");
          return callback(err, data);
        };
      })(this));
    };

    BaseStorage.prototype.get_acl = function(params, callback) {
      return this.s3.getBucketAcl(params, function(err, data) {
        console.log("get_acl");
        if (data != null) {
          console.log(data.Grants);
        }
        return callback(err, data);
      });
    };

    BaseStorage.prototype.get_object = function(params, callback) {
      return this.s3.getObject(params, function(err, data) {
        console.log("get_object");
        return callback(err, data);
      });
    };

    BaseStorage.prototype.head_bucket = function(bucket, callback) {
      var params;
      params = this.create_params(bucket, null);
      return this.s3.headBucket(params, (function(_this) {
        return function(err, data) {
          console.log("headBucket");
          return callback(err, data);
        };
      })(this));
    };

    BaseStorage.prototype.head_object = function(bucket, key, callback) {
      var params;
      params = this.create_params(bucket, key);
      return this.s3.headObject(params, (function(_this) {
        return function(err, data) {
          console.log("head_object");
          return callback(err, data);
        };
      })(this));
    };

    BaseStorage.prototype.put_object = function(bucket, key, callback, params) {
      if (params == null) {
        params = {};
      }
      params = this.create_params(bucket, key, params);
      return this.s3.putObject(params, function(err, data) {
        console.log("put_object");
        return callback(err, data);
      });
    };

    BaseStorage.prototype.list_buckets = function(callback) {
      return this.s3.listBuckets(null, function(err, data) {
        console.log("list_buckets");
        if (data != null) {
          console.log(data.Buckets);
        }
        return callback(err, data);
      });
    };

    BaseStorage.prototype.list_objects = function(bucket, callback, params) {
      if (params == null) {
        params = {};
      }
      params = this.create_params(bucket, null, params);
      return this.s3.listObjects(params, (function(_this) {
        return function(err, data) {
          console.log("list_objects");
          if (data != null) {
            console.log(data.Contents);
          }
          return callback(err, data);
        };
      })(this));
    };

    BaseStorage.prototype.create_params = function(bucket, key, params) {
      if (params == null) {
        params = {};
      }
      if (bucket != null) {
        params.Bucket = bucket;
      }
      if (key != null) {
        params.Key = key;
      }
      return params;
    };

    return BaseStorage;

  })();

  module.exports = BaseStorage;

}).call(this);
