'use strict';
var local = {

    REMOTE: /http[s]*\:\/\//,
    REMOTE_HTTP: /http\:\/\//,
    REMOTE_HTTPS: /https\:\/\//,
    LOCAL_WINDOWS: /[a-zA-Z]\:/,
    LOCAL_UNIX: /^\//,
    LOCAL_RELATVE: /^.+\//
};


module.exports = {
    /**
     *  @param configMap {char: config.char, width: config.defaultWidth, left: config.defaultLeft}
     */
    setParams: function(paramOption, paramSet) {
        var param = {};
        for (var key in paramSet) {
            if (paramOption[key]) {
                param[key] = paramOption[key];
            } else {
                param[key] = paramSet[key];
            }
        }
        return param;
    },
    /**
     *  fix relative path to full path
     */
    urlFixing: function(url) {

        if (local.REMOTE.exec(url)) {
            // HTTP or HTTPS
            return url;
        }
        else if (local.LOCAL_WINDOWS.exec(url) || local.LOCAL_UNIX.exec(url)) {
            // Absolute path
            return url;
        }
        else {
            // relative path
            return process.cwd().replace(/\/$/, '') + '/' + url;
        }
    },
    /**
     *  comment
     **/
    urlType: function (url) {
        var type = {};
        
        if (local.REMOTE_HTTP.exec(url)) {
            type.http =  true;
        } else if (local.REMOTE_HTTPS.exec(url)) {
            type.https = true;
        } else if (local.LOCAL_WINDOWS.exec(url)) {
            type.windows = true;
        } else if (local.LOCAL_UNIX.exec(url)) {
            type.unix = true;
        } else if (local.LOCAL_RELATVE.exec(url)) {
            type.relative = true;
        }
    }
}
