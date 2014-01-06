'use strict';

var request = require('request'),
    fs = require('fs'),
    path = require('path'),
    util = require('util');
/**
 *  load remote image file by path
 **/
module.exports = {
    /**
     *  @param url
     *  @return stream
     **/
    load: function (url) {
        var type = util.urlType(url);

        if (type.http || type.https) {

            return request(url);
        } else if (type.relative) {

            return fs.createReadStream(path.resolve(url));
        } else if (type.window || type.unix) {

            return fs.createReadStream(url);
        } else {
            // stream.emit('error', 'unknow file path, please give a correct image file path !')
            return null;
        }
    }
}