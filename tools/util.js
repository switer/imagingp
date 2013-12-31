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

        if (url.match(/http[s]*\:\/\//)) {
            return url;
        }
        else if (url.match(/[a-zA-Z]\:/) || url.match(/^\//)) {
            return url;
        }
        else {
            return process.cwd().replace(/\/$/, '') + '/' + url;
        }
    }
}
