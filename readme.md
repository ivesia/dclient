# Dclient

-------

A Dnspod client by Node.js

### 介绍

DClient 是一个 Node.Js 的第三方 Dnspod 客户端，使用 Promise 控制异步流程，使用官方推荐的 Token 验证，保证用户信息安全，可以在 Linux 等命令行中调用。

### 安装
```sh
npm install dclient
```

### 使用方法
```javascript
var DClient = require('dclient');

var client = new DClient('10002,85c4cece0ced14dba4837d13c2cab0e0'); // ID,Token 的组合方式

client.infoVersion().then(function (res) {
    console.log(res); // 返回信息
}, function (error) {
    console.log(error) // 请求错误信息
});
```

### API

#### 初始化

#### DClient.email

默认为 `dclient@example.com`，设置邮箱，用于请求的 User-Agent 中。建议将邮箱设置为自己的邮箱

```javascript
DClient.email = 'mymail@example.com'; // ID,Token 的组合方式
```

#### DClient.version

返回程序的版本，同样用在 User-Agent 中。

#### DClient.debug

默认为 `false`，设置 debug 模式，在命令行中输出请求信息

##### new Dclient(params);

**params** *String* "ID,Token" 形式的组合

```javascript
var client = new DClient('10002,85c4cece0ced14dba4837d13c2cab0e0'); // ID,Token 的组合方式
```

**params** *Object* 属性有 `login_token`，默认为空；`format`，返回数据的格式，默认为 `json`；`lang`，返回信息的语言，默认为 `cn`，也可以添加其他官方的公共参数。

```javascript
var client = new DClient({
    login_token: '10002,85c4cece0ced14dba4837d13c2cab0e0',
    format: 'xml',
    'lang': 'en'
});
```

##### client.getOutIp(); DClient.getOutIp();

类和实例都有这个方法，获取客户端出口 IP，供 DDNS 来使用，本模块未作 IP 变动修改的检测，所以需要自己实现变动修改，防止被系统锁定；

```javascript
client.getOutIp().then(function (ip) {
    console.log(ip); // 返回的出口 IP
});
```

##### client.onResponse

默认为 `undefined`，在请求发送前设置，可以设置为回调函数，可以处理所有请求的结果，通常用于记录 log 等。

回调函数接收参数有：`action` 请求的 API 名称，`params` 请求的参数及请求头，`response` 请求的返回头。用法如下

```javascript
client.onResponse = function (action, params, response) {
    console.log(action, params, response); // 自己的逻辑
}
```

##### 其他官方 API

其他 API 及参数返回值参考官方文档 [https://www.dnspod.cn/docs/index.html](https://www.dnspod.cn/docs/index.html)

如请求地址为 `https://dnsapi.cn/Record.Ddns` 则对应的 api 为 `client.recordDdns`，参数添加每个接口的特殊参数，公共参数不用添加。例如：

```javascript
client.recordDdns({
    domain_id: 10001,
    record_id: 16909160,
    sub_domain: 'www',
    record_line: '默认',
    value: '6.6.6.6' // 可以使用 client.getOutIp() 来获取出口 ip
}).then(function (res) {
    console.log(res); // 返回信息
});
```

返回值

```json
{
    "status": {
        "code":"1",
        "message":"Action completed successful",
        "created_at":"2015-01-18 17:23:58"
    },
    "record": {
        "id":16909160,
        "name":"www",
        "value":"6.6.6.6"
    }
}
```

### License

MIT
