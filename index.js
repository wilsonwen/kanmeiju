var express = require('express');
var request = require('request');
var parser = require('body-parser');
var md5 = require('md5')
var redis = require('redis')
var app = express();
var client = redis.createClient(process.env.REDIS_URL);

/**
 * Configuration
 */
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/web/build/'));
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
          next();
});

/**
 * Constant Variable
 */
SERVER = "http://api.rr.tv";
SECRET_KEY = "clientSecret=08a30ffbc8004c9a916110683aab0060";
FAKE_HEADERS = {
    "clientType": "android_%E8%B1%8C%E8%B1%86%E8%8D%9A",
    "clientVersion": "3.5.3.1",
    "deviceId": "861134030056126",
    "token": "5f8f489d12f64488aa310334f32153b4",
    "signature": "643c184f77372e364550e77adc0360cd",
    "t": "1491433993933"
};

/**
 * Serve index
 */
app.get('/', function(req, res) {
    res.sendfile('index.html')
});

/**
 * getJSON as client
 */
function getJSON(url, response, body, headers=FAKE_HEADERS) {
    
    var options = {
        url : url,
        headers : headers,
        method: 'POST',
        form: body
    };

    // add redis cache
    var key = JSON.stringify(body);
    client.exists(key, function(err, reply) {
        if (reply === 1) {
            client.get(key, function(err, reply) {
                response.send(reply);
            });
        } else {
            req = request(options).on('error', function(err) {
                console.log(err);
                response.status(500).send({code:'5000', 'msg': err});
            }).on('response', function(res) {
                var buffer = "";
                res.on('data', function(data) {
                    buffer += data;
                }).on('end', function() {
                    client.set(key, buffer, function(err, reply){
                        response.send(buffer)
                    });
                });
            })

        }
    });
}

/**
 * API: Search
 *
 * {'title' : 'bigbang'}
 */
app.get('/api/search/:title', function(req, res) {
    var API = SERVER + '/v3plus/video/search'
    console.log('/api/search/', req.params.title);
    getJSON(API, res, {'title': req.params.title });
});

/**
 * API: Detail
 *
 * {'seasonId' : 1888}
 */
app.get('/api/detail/:seasonId', function(req, res) {
    var API = SERVER + '/v3plus/season/detail'
    console.log('/api/detail/', req.params.seasonId)
    getJSON(API, res, {'seasonId': req.params.seasonId}); 
});

/**
 * API: M3u8
 *
 * {'episodeSid' : 25005, 'quality' : 'super'}
 */
app.get('/api/m3u8/:episodeSid', function(req, res) {
    var API = SERVER + '/video/findM3u8ByEpisodeSid'
    
    // calculate signature
    var headers = FAKE_HEADERS;
    var body = {}
    body['episodeSid'] = req.params.episodeSid;
    body['quality'] = 'super';
    key = 'episodeSid=' + req.params.episodeSid;
    key += 'quality=' + 'super';
    key += 'clientType=' + FAKE_HEADERS['clientType'];
    key += 'clientVersion=' + FAKE_HEADERS['clientVersion'];
    key += 't=' + FAKE_HEADERS['t'];
    key += SECRET_KEY;
    headers['signature'] = md5(key);
    body['token'] = FAKE_HEADERS['token'];
    body['seasonId'] = 0;

    console.log(key)
    console.log(md5(key))
    console.log('/api/m3u8/', req.params.episodeSid)
    getJSON(API, res, body, headers)

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


