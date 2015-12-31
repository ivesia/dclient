"use strict";

var net = require('net');
require('es6-promise').polyfill();

var getOutIp = function () {
    return new Promise(function (resolve, reject) {
        var ddns = net.connect({
            host: 'ns1.dnspod.net',
            port: 6666
        });

        ddns.on('data', function (data) {
            resolve(data.toString());
        });

        ddns.on('error', function (err) {
            reject(err);
        });
    });
};

module.exports = getOutIp;
