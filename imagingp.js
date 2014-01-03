var converter = require('./tools/convert.js'),
    util = require('./tools/util'),
    config = require('./config');

module.exports = {
    draw: function (path /*, options, callback*/) {
        var args = arguments,
        options = {},
        callback;

        var param2 = args[1];

        if (typeof(param2) == 'function') {
            callback = param2;
        } else if (typeof(param2) == 'object'){
            options = param2;
        }
        if (!callback) {
            callback = args[2];
        }

        var imgURL = path;
        if (!imgURL) {
            console.log('Please give a correct image url !'.red)
            return;
        } else {
            imgURL = util.urlFixing(imgURL);
        }

        // monkeypath option
        options = util.setParams(options, {
            char: config.char.default,
            width: config.defaultWidth,
            left: config.defaultLeft
        });
        // run
        converter.convert(imgURL, options, callback);
    }
};