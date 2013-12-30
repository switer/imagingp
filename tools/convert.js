/**
 *  imaging-png
 *  http://github.com/switer/imaging-png
 *
 *  Copyright (c) 2013 "switer" guankaishe
 *  Licensed under the MIT license.
 *  https://github.com/switer/imaging-png/blob/master/LICENSE
 */
'use strict';

var fs = require('fs'),
    color = require('colors'),
    Chain = require('chainjs'),
    PNG = require('pngjs').PNG;

var config = {
    pix: '▇',
    defaultWidth: 40,
    colorMap: {
        /*normal*/
        '0,0,0': 'black',
        '0,0,128': 'blue',
        '0,128,0': 'green',
        '0,128,128': 'cyan',
        '128,0,0': 'red',
        '128,0,128': 'magenta',
        '128,128,0': 'yellow',
        '128,128,128': 'grey',
        '192,192,192': 'white',
        /*light*/
        '0,0,255': ['blue', 'grey'],
        '0,255,0': ['green', 'grey'],
        '0,255,255': ['cyan', 'grey'],
        '255,0,0': ['red', 'grey'],
        '255,0,255': ['magenta', 'grey'],
        '255,255,0': ['yellow', 'grey'],
        '255,255,255': ['white', 'grey'],
        /*likes*/
        '128,128,255': ['blue', 'grey'],
        '128,0,255': ['blue', 'grey'],
        '0,128,255': ['blue', 'grey'],
        '128,255,128': ['green', 'grey'],
        '0,255,128': ['green', 'grey'],
        '128,255,0': ['green', 'grey'],
        '128,255,255': ['cyan', 'grey'],
        '255,128,128': ['red', 'grey'],
        '255,128,0': ['red', 'grey'],
        '255,0,128': ['red', 'grey'],
        '255,128,255': ['magenta', 'grey'],
        '255,255,128': ['yellow', 'grey']
    }
};

var converter = {
    /**
     *  Module enter API
     *  convert a image file to character string
     */
    convert: function(file) {

        var _this = this;

        fs.createReadStream(file)
            .pipe(new PNG({
                filterType: 4
            }))
            .on('parsed', function(data) {
                var imgData = data,
                    ctx = this;

                var colorData = _this.process(ctx.height, ctx.width, imgData);

                Chain(_this.render.bind(_this), colorData, {
                    height: ctx.height,
                    width: ctx.width
                })
                .final(function () {
                    console.log('render compeleted!');
                })
                .start();

            });
    },
    /**
     *  Image data process
     *  convert image RGBA color to 18 colors
     */
    process: function(height, width, imgData) {

        var len = imgData.length / 4,
            index = 0,
            colors = [],
            colorKey = '';

        for (var i = 0, index = 0; i < len; i++, index += 4) {

            var alpha = imgData[index + 3] / 255,
                oralR = imgData[index],
                oralG = imgData[index + 1],
                oralB = imgData[index + 2],
                red = this.pick18Colors(imgData[index], alpha),
                green = this.pick18Colors(imgData[index + 1], alpha),
                blue = this.pick18Colors(imgData[index + 2], alpha);

            var grayColorKey = grayColor(rgba2rbg(oralR, alpha), rgba2rbg(oralG, alpha), rgba2rbg(oralB, alpha));
            if (grayColorKey) {
                colorKey = grayColorKey;
            } else {
                colorKey = [red, green, blue].join(',');
            }

            colors.push(config.colorMap[colorKey]);
        }

        return colors;
    },
    /**
     *  render character image in terminal
     */
    render: function(chain, colors, options) {
        
        var line = repeat(' ', 0);

        for (var i = 0; i < colors.length; i++) {

            if (i % options.width !== 0) {
                if (typeof(colors[i]) === 'string') {
                    line += config.pix[colors[i]];
                } else if (colors[i] instanceof Array) {
                    line += config.pix[colors[i][0]][colors[i][1]];
                }
            } else {
                // use console to show image pixel line
                console.log(line);
                line = repeat(' ', 0);
            }
        }
        chain.next();
    },
    /**
     *  convert rgba format to rbg
     */
    rgba2rbg: function(colorValue, alpha) {
        return ((1 - alpha) * 255 + alpha * colorValue);
    },
    /**
     *  convert 32bit colors to terminal colors
     */
    pick18Colors: function(colorValue, alpha) {
        if (alpha == undefined) alpha = 1;
        var cv = Math.floor((this.rgba2rbg(colorValue, alpha)));
        if (cv >= 170) return 255;
        else if (cv >= 85 && cv < 170) return 128;
        else return 0;
    },
    /**
     *  if a number in the specified range
     */
    nearby: function(value, min, max) {
        return (value > min && value <= max);
    },
    /**
     *  pick the gray color
     */
    grayColor: function(red, green, blue) {

        var min = 170,
            max = 230;
        if (this.nearby(red, min, max) && this.nearby(green, min, max) && this.nearby(blue, min, max)) {
            return '192,192,192';
        } else {
            return null;
        }
    },
    /**
     *  create repeat string with string element
     */
    repeat: function(str, times) {
        var index = 0,
            ctn = '';
        while (index < times) {
            ctn += str;
            index++;
        }
        return ctn;
    }
};


converter.convert('../res/in.png');



function canvasProcess(height, width, imgData) {

    var len = imgData.length / 4,
        index = 0,
        colors = [],
        colorKey = '';

    for (var i = 0, index = 0; i < len; i++, index += 4) {

        var alpha = imgData[index + 3] / 255,
            oralR = imgData[index],
            oralG = imgData[index + 1],
            oralB = imgData[index + 2],
            red = transColor(imgData[index], alpha),
            green = transColor(imgData[index + 1], alpha),
            blue = transColor(imgData[index + 2], alpha);

        var grayColorKey = grayColor(rgba2rbg(oralR, alpha), rgba2rbg(oralG, alpha), rgba2rbg(oralB, alpha));
        if (grayColorKey) {
            colorKey = grayColorKey;
        } else {
            colorKey = [red, green, blue].join(',');
        }

        colors.push(config.colorMap[colorKey]);
    }

    draw(colors, {
        height: height,
        width: width
    }, function() {

    });
    return pixData;
}
/**
 *  if a number in the specified range
 */

function nearby(value, min, max) {
    return (value > min && value <= max);
}
/**
 *  pick the gray color
 */

function grayColor(red, green, blue) {

    var min = 170,
        max = 230;
    if (nearby(red, min, max) && nearby(green, min, max) && nearby(blue, min, max)) {
        return '192,192,192';
    } else {
        return null;
    }
}

function repeat(str, times) {
    var index = 0,
        ctn = '';
    while (index < times) {
        ctn += str;
        index++;
    }
    return ctn;
}

function draw(colors, options, callback) {

    var line = repeat(' ', 0);

    for (var i = 0; i < colors.length; i++) {

        if (i % options.width !== 0) {
            if (typeof(colors[i]) === 'string') {
                line += config.pix[colors[i]];
            } else if (colors[i] instanceof Array) {
                line += config.pix[colors[i][0]][colors[i][1]];
            }
        } else {
            console.log(line);
            line = repeat(' ', 0);
        }
    }
    callback && callback();
}

function transColor(value, alpha) {
    if (alpha == undefined) alpha = 1;
    var cv = Math.floor((rgba2rbg(value, alpha)));
    if (cv >= 170) return 255;
    else if (cv >= 85 && cv < 170) return 128;
    else return 0;
}

function rgba2rbg(value, alpha) {
    return ((1 - alpha) * 255 + alpha * value);
}
