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

    thumbnailer: function(imgMeta, width, raidus, callback) {

        this.data.src = imgMeta;

        this.data.dest = {
            width: width,
            height: Math.round(imgMeta.height * width / imgMeta.width),
        };

        this.data.dest.data = new Array(this.data.dest.width * this.data.dest.height * 4);

        this.data.lanczos = this.lanczosCreate(raidus);

        this.data.ratio = imgMeta.width / width;

        this.data.rcp_ratio = 2 / this.data.ratio;

        this.data.range2 = Math.ceil(this.data.ratio * raidus / 2);

        this.data.cacheLanc = {};
        this.data.center = {};
        this.data.icenter = {};

        var _this = this;
        setTimeout(function() {
            _this.processImageData(_this.data, 0, callback);
        }, 0);
            
    },

    processImageData: function(data, u, callback) {

        data.center.x = (u + 0.5) * data.ratio;
        data.icenter.x = Math.floor(data.center.x);

        for (var v = 0; v < data.dest.height; v++) {

            data.center.y = (v + 0.5) * data.ratio;

            data.icenter.y = Math.floor(data.center.y);

            var alpha, red, green, blue;

            alpha = red = green = blue = 0;
            // alpha = 0.5;
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

                    var weight = data.cacheLanc[f_x][f_y];

                    if (weight > 0) {
                        var idx = (j * data.src.width + i) * 4;
                        alpha += weight;
                        red += weight * data.src.data[idx];
                        green += weight * data.src.data[idx + 1];
                        blue += weight * data.src.data[idx + 2];
                    }
                }
            }
            var idx = (v * data.dest.width + u) * 4;

            data.dest.data[idx] = Math.ceil(red / alpha);
            data.dest.data[idx + 1] = Math.ceil(green / alpha);
            data.dest.data[idx + 2] = Math.ceil(blue / alpha);
            // data.dest.data[idx + 3] = Math.ceil(alpha);
            data.dest.data[idx + 3] = 255;
        }

        if (++u < data.dest.width)
            setTimeout(this.processImageData.bind(this), 0, data, u, callback);
        else
            setTimeout(this.responseImageData.bind(this), 0, data, callback);
    },
    responseImageData: function(data, callback) {
        callback(data.dest);
    }
}


module.exports = thumb;