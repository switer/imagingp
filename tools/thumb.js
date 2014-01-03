var thumb = {

    data: {

    },
    lanczosCreate: function(raidus) {

        return function(x) {

            if (x > raidus)
                return 0;
            x *= Math.PI;
            if (Math.abs(x) < 1e-16)
                return 1
            var xx = x / raidus;
            return Math.sin(x) * Math.sin(xx) / x / xx;
        }
    },

    createImageDataArray: function (row, col, value) {
        var imageData = [],
            rowArray = [];
        for (var i =0 ; i < row; i ++) {
            rowArray = rowArray.concat([value, value, value, value]);
        }
        for (var i =0 ; i < col; i ++) {
            imageData = imageData.concat(rowArray);
        }
        return imageData;
    },
    /**
     *  Thumb a image(ImageData) with raduis and width
     **/
    thumbnailer: function(imgMeta, width, raidus, callback) {
        if (width == imgMeta.width) {
            callback(imgMeta);
            return;
        }

        thumb.data.src = imgMeta;

        thumb.data.dest = {
            width: width,
            height: Math.round(imgMeta.height * width / imgMeta.width),
        };

        thumb.data.dest.data = new Array(thumb.data.dest.width * thumb.data.dest.height * 3);

        thumb.data.lanczos = thumb.lanczosCreate(raidus);

        thumb.data.ratio = imgMeta.width / width;

        thumb.data.rcp_ratio = 2 / thumb.data.ratio;

        thumb.data.range2 = Math.ceil(thumb.data.ratio * raidus / 2);

        thumb.data.cacheLanc = {};
        thumb.data.center = {};
        thumb.data.icenter = {};

        thumb.processImageData(thumb.data, 0, callback);
            
    },

    processImageData: function(data, u, callback) {

        data.center.x = (u + 0.5) * data.ratio;
        data.icenter.x = Math.floor(data.center.x);

        for (var v = 0; v < data.dest.height; v++) {

            data.center.y = (v + 0.5) * data.ratio;

            data.icenter.y = Math.floor(data.center.y);

            var alpha, red, green, blue;

            alpha = red = green = blue = 0;

            for (var i = data.icenter.x - data.range2; i <= data.icenter.x + data.range2; i++) {

                if (i < 0 || i >= data.src.width)
                    continue;

                var f_x = Math.floor(1000 * Math.abs(i - data.center.x));

                if (!data.cacheLanc[f_x])
                    data.cacheLanc[f_x] = {};

                for (var j = data.icenter.y - data.range2; j <= data.icenter.y + data.range2; j++) {

                    if (j < 0 || j >= data.src.height)
                        continue;

                    var f_y = Math.floor(1000 * Math.abs(j - data.center.y));

                    if (data.cacheLanc[f_x][f_y] == undefined)
                        data.cacheLanc[f_x][f_y] = data.lanczos(Math.sqrt(Math.pow(f_x * data.rcp_ratio, 2) + Math.pow(f_y * data.rcp_ratio, 2)) / 1000);

                    weight = data.cacheLanc[f_x][f_y];
                    // console.log(weight);
                    if (weight > 0) {
                        var idx = (j * data.src.width + i) * 4;
                        alpha += weight;
                        red += weight * data.src.data[idx];
                        green += weight * data.src.data[idx + 1];
                        blue += weight * data.src.data[idx + 2];
                    }
                }
            }
            var idx = (v * data.dest.width + u) * 3;

            data.dest.data[idx] = red / alpha;
            data.dest.data[idx + 1] = green / alpha;
            data.dest.data[idx + 2] = blue / alpha;
        }

        if (++u < data.dest.width)
            thumb.processImageData(data, u, callback);
        else
            thumb.responseImageData(data, callback);
    },
    responseImageData: function(data, callback) {

        data.src = {
            data: thumb.createImageDataArray(data.dest.width, data.dest.height, 255),
            height: data.dest.height,
            width: data.dest.width
        };

        // console.log(data.src.data.length);

        var idx, idx2;
        for (var i = 0; i < data.dest.width; i++) {
            for (var j = 0; j < data.dest.height; j++) {
                idx = (j * data.dest.width + i) * 3;
                idx2 = (j * data.dest.width + i) * 4;
                data.src.data[idx2] = data.dest.data[idx];
                data.src.data[idx2 + 1] = data.dest.data[idx + 1];
                data.src.data[idx2 + 2] = data.dest.data[idx + 2];
            }
        }
        callback(data.src);

    }.bind(thumb)
}


module.exports = thumb;