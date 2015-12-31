"use strict";

require('es6-promise').polyfill();
var request = require('request');
var _ = require('lodash');
var getOutIp = require('./outip');

var version = require('../package.json').version;

var promiseRequest = function (options) {
    return new Promise(function (resolve, reject) {
        request(options, function (error, response) {
            if (!error && response.statusCode === 200) {
                return resolve(response);
            }

            return reject(error || response.statusCode);
        });
    });
};

var DClient = function DClient(params) {
    if (!(this instanceof DClient)) {
        return new DClient(params);
    }

    this._init(params);
};

_.extend(DClient, {
    version: version,
    email: '',
    debug: false,
    getOutIp: getOutIp
});

_.extend(DClient.prototype, {
    _init: function (params) {
        if (_.isString(params)) {
            params = {'login_token': params};
        }

        this._tokenCheck(params);

        var email = params.support_email || DClient.email;
        delete params.support_email;

        this.params = _.extend({
            'login_token': '',
            'format': 'json',
            'lang': 'cn'
        }, params);

        this.requestParams = {
            method: 'post',
            url: 'https://dnsapi.cn/',
            headers: {
                'User-Agent': 'DClient Node/' + version + (email ? '(' + email + ')' : '')
            }
        };

        request.debug = DClient.debug;
    },

    _request: function (action, params) {
        var self = this;
        var options = {
            method: this.requestParams.method,
            url: this.requestParams.url + action,
            headers: this.requestParams.headers,
            form: _.extend(this.params, params)
        };

        return promiseRequest(options).then(function (res) {
            var body = res.body;
            return new Promise(function (resolve, reject) {
                if (!self.params.format.toLowerCase() === 'json') {
                    return resolve(body);
                }

                try {
                    body = JSON.parse(body);
                } catch (err) {
                    return reject(err);
                }

                if (_.isFunction(self.onResponse)) {
                    self.onResponse(action, options, res);
                }

                resolve(body);
            });
        });
    },

    _tokenCheck: function (params) {
        if (!params.login_token && DClient.debug) {
            if (!params.login_email && !params.login_password) {
                return console.error('必须使用一种鉴权方式');
            }

            console.warn('建议使用 Token 来鉴权');
        }
    },

    getOutIp: getOutIp
});

var apiList = [
    'Info.Version',

    'User.Detail',
    'User.Modify',
    'Userpasswd.Modify',
    'Useremail.Modify',
    'Telephoneverify.Code',
    'User.Log',

    'Domain.Create',
    'Domain.List',
    'Domain.Remove',
    'Domain.Status',
    'Domain.Info',
    'Domain.Log',
    'Domain.Searchenginepush',

    'Domainshare.Create',
    'Domainshare.List',
    'Domainshare.Modify',
    'Domainshare.Remove',
    'Domain.Transfer',
    'Domain.Lock',
    'Domain.Lockstatus',
    'Domain.Unlock',
    'Domainalias.List',
    'Domainalias.Create',
    'Domainalias.Remove',
    'Domaingroup.List',
    'Domaingroup.Create',
    'Domaingroup.Modify',
    'Domaingroup.Remove',
    'Domain.Changegroup',
    'Domain.Ismark',
    'Domain.Remark',
    'Domain.Purview',
    'Domain.Acquire',
    'Domain.Acquiresend',
    'Domain.Acquirevalidate',
    'Record.Type',
    'Record.Line',

    'Record.Create',
    'Record.List',
    'Record.Modify',
    'Record.Remove',
    'Record.Ddns',
    'Record.Remark',
    'Record.Info',
    'Record.Status',

    'Batch.Domain.Create',
    'Batch.Record.Create',
    'Batch.Record.Modify',
    'Batch.Detail',

    'Monitor.Listsubdomain',
    'Monitor.Listsubvalue',
    'Monitor.List',
    'Monitor.Create',
    'Monitor.Modify',
    'Monitor.Remove',
    'Monitor.Info',
    'Monitor.Setstatus',
    'Monitor.Gethistory',
    'Monitor.Userdesc',
    'Monitor.Getdowns'
];

apiList.forEach(function (api) {
    var key = _.camelCase(api);
    DClient.prototype[key] = (function (action) {
        return function (params) {
            return this._request(action, params);
        };
    }(api));
});

module.exports = DClient;
