'use strict';

var Jpgjs = require('../lib/jpgjs');

/**
 *  override
 **/
Jpgjs.prototype.load = function () {
    // var xhr = new XMLHttpRequest();
    // xhr.open("GET", path, true);
    // xhr.responseType = "arraybuffer";
    // xhr.onload = (function() {
    //     var data = new Uint8Array(xhr.response || xhr.mozResponseArrayBuffer);
    //     this.parse(data);
    //     if (this.onload)
    //         this.onload();
    // }).bind(this);
    // xhr.send(null);
}

/**
 *  
 **/
module.exports = {
    parse: function () {
        var img = new Jpgjs();

    }
}