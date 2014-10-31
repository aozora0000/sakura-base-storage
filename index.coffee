class BaseStorage
    AWS = require 'aws-sdk'
    path = require 'path'

    constructor: (file) ->
        AWS.config.loadFromPath path.normalize file
        @s3 = new AWS.S3()

    bucket: ->
        head: (bucket, callback) ->
            params = @create_params bucket, null
            @s3.headBucket params, (err, data) =>
                callback err, data

        list: (callback) ->
            @s3.listBuckets null, (err, data) ->
                console.log data.Buckets if data?
                callback err, data

        create: (bucket, callback, params = {}) ->
            params = @create_params bucket, null, params
            @bucket.head bucket, (err, data) =>
                if err?.statusCode is 404
                    @s3.createBucket params, (err, data) ->
                        callback err, data
                else
                    callback err, data

        delete: (bucket, callback) ->
            params = @create_params bucket, null
            @bucket.head bucket, (err, data) =>
                if err?.statusCode is 404
                    callback null, data
                else if err?.statusCode is 403
                    callback err, data
                else if err?.statusCode is 301
                    callback err, data
                else
                    @s3.deleteBucket params, (err, data) ->
                        callback err, data

        force_delete: (bucket, callback) ->
            @bucket.head bucket, (err, data) =>
                if err?.statusCode is 404
                    callback null, data
                else if err?.statusCode is 403
                    callback err, data
                else
                    @list_objects bucket, (err, data) =>
                        if err
                            callback err, data
                        else
                            unless data.Contents.length is 0
                                @object.deletes bucket, data.Contents, (err, data) =>
                                    if err
                                        callback err, data
                                    else
                                        params = @create_params bucket, null
                                        @s3.deleteBucket params, (err, data) ->
                                            callback err, data
                            else
                                params = @create_params bucket, null
                                @s3.deleteBucket params, (err, data) ->
                                    callback err, data

    object: ->
        delete: (bucket, key, callback) ->
            params = @create_params bucket, key
            @object.head bucket, key, (err, data) =>
                if err?.statusCode is 404
                    callback null, data
                else if err?.statusCode is 403
                    callback err, data
                else
                    @s3.deleteObject params, (err, data) ->
                        callback err, data

        deletes: (bucket, deletes, callback, params = {}) ->
            params = @create_params bucket, null, params
            keys = []
            for key in deletes
                keys.push { Key: key.Key }
            params.Delete = {
                Objects: keys
            }
            @s3.deleteObjects params, (err, data) ->
                console.log "delete_objects"
                callback err, data

        version: (bucket, callback) ->
            params = @create_params bucket, null
            @s3.getBucketVersioning params, (err, data) =>
                callback err, data

        acl: (params, callback) ->
            @s3.getBucketAcl params, (err, data) ->
                console.log data.Grants if data?
                callback err, data

        get: (params, callback) ->
            @s3.getObject params, (err, data) ->
                callback err, data

        head: (bucket, key, callback) ->
            params = @create_params bucket, key
            @s3.headObject params, (err, data) =>
                callback err, data

        put: (bucket, key, callback, params = {}) ->
            params = @create_params bucket, key, params
            @s3.putObject params, (err, data) ->
                callback err, data
        list: (bucket, callback, params = {}) ->
            params = @create_params bucket, null, params
            @s3.listObjects params, (err, data) =>
                console.log data.Contents if data?
                callback err, data

    create_params: (bucket, key, params = {}) ->
        params.Bucket = bucket if bucket?
        params.Key = key if key?
        return params

module.exports = BaseStorage
