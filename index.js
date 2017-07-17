var express = require('express');
var request = require('request');
var parser = require('body-parser');
var md5 = require('md5')
var redis = require('redis')
var mongoose = require('mongoose')
var app = express();
var client = redis.createClient(process.env.REDIS_URL);
mongoose.connect(process.env.MONGODB_URI);

/**
 * Configuration
 */
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/frontend/build'));
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
 *
 * url - url of api
 * body - from body data
 * callback - callback function with returning json
 * headers - headers if necessary
 */
function getJSON(url, body, callback, headers=FAKE_HEADERS) {
    
    var options = {
        url : url,
        headers : headers,
        method: 'POST',
        form: body
    };

    var buffer = "";
    var req = request(options).on('error', function(err) {
        console.log(err);
        buffer = {code:'5000', 'msg': err};
    }).on('response', function(res) {
        var buffer = "";
        res.on('data', function(data) {
            buffer += data;
        }).on('end', function() {     
            callback(buffer);
        });
    });  
}

/**
 * cacheAndGet
 * 
 * cache is redis, if not try to get from remote
 *
 */
function cacheAndGet(api, body, getter, callback) {
    var key = api + JSON.stringify(body);
    client.exists(key, function(err, reply) {
        if (reply === 1) {
            client.get(key, function(err, reply) {
                callback(reply);
            });
        } else {
            // Fetch remote data and set k,v in callback
            getter(api, body, function(json) {
                callback(json);
                client.set(key, json);
                // Expire after 24 hours
                client.expire(key, 7200);
            });
        }
    });
}


/**
 * API: Search
 *
 * {'title' : 'bigbang'}
 */
app.get('/api/search/:title', function(req, res) {
    var api = SERVER + '/v3plus/video/search'
    var body = {'title': req.params.title };
    console.log('/api/search/');

    // Check Redis and get from remote
    cacheAndGet(api, body, getJSON, function(json){
        res.send(json);
    })
    
});

/**
 * API: Detail
 *
 * {'seasonId' : 1888}
 */
app.get('/api/detail/:seasonId', function(req, res) {
    var api = SERVER + '/v3plus/season/detail'
    var body = {'seasonId': req.params.seasonId}
    console.log('/api/detail/', req.params.seasonId)
   
    // Check Redis and get from remote
    cacheAndGet(api, body, getJSON, function(json){
        res.send(json);
    })
});


/*
 * Saving m3u8 in mongodb
 * Because rr limit requests 30times per minute.
 */
var m3u8Schema = mongoose.Schema({
    episodeSid: String,
    json: Object
});
var M3u8 = mongoose.model('m3u8', m3u8Schema);
/**
 * API: M3u8
 *
 * {'episodeSid' : 25005, 'quality' : 'super'}
 */
app.get('/api/m3u8/:episodeSid', function(req, res) {
    var api = SERVER + '/video/findM3u8ByEpisodeSid'
    
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

    // logging to debug
    console.log(key)
    console.log(md5(key))
    console.log('/api/m3u8/', req.params.episodeSid)

    // Check Redis cache first
    var key = api + JSON.stringify(body);
    client.exists(key, function(err, reply) {
        if (reply === 1) {
            client.get(key, function(err, reply) {
                res.send(reply);
            });
        } else {
            // try to find in mongodb
            M3u8.find({episodeSid: req.params.episodeSid}, function(err, m3u8s){
                if(err) return console.log(err);
                if (m3u8s.length !== 0) {
                    res.send(mu3u8s[0]);
                } else {
                    // Fetch remote data and set k,v in callback
                    getJSON(api, body, function(json) {
                        res.send(json);
                        client.set(key, json);
                        var m3u8 = new M3u8({episodeSid: req.params.episodeSid, json: json})
                        m3u8.save();
                    }, headers);
                }
            });
        }
    });

});

/**
 * API: Index
 *
 */
 app.get('/api/index', function(req, res) {
    var api = SERVER + '/v3plus/video/indexInfo'
    var body = {}
    console.log('/api/index');

    // Check Redis and get from remote
    cacheAndGet(api, body, getJSON, function(json){
        res.send(json);
    })
 });

 /**
 * API: hot
 *
 */
 app.get('/api/hot', function(req, res) {
    var api = SERVER + '/video/seasonRankingList'
    var body = {}
    console.log('/api/hot');

    // Check Redis and get from remote
    cacheAndGet(api, body, getJSON, function(json){
        res.send(json);
    })
 });

 /**
 * API: top
 *
 */
 app.get('/api/top', function(req, res) {
    var api = SERVER + '/v3plus/season/topList'
    var body = {}
    console.log('/api/top');

    // Check Redis and get from remote
    cacheAndGet(api, body, getJSON, function(json){
        res.send(json);
    });
 });

 /**
 * API: album
 *
 */
 app.get('/api/album/:albumId', function(req, res) {
    var api = SERVER + '/v3plus/video/album'
    var body = {'albumId': req.params.albumId}
    console.log('/api/album');

    // Check Redis and get from remote
    cacheAndGet(api, body, getJSON, function(json){
        res.send(json);
    });
 });

 /**
 * API: category
 *
 */
 app.get('/api/category/:categoryType/:pages', function(req, res) {
    var api = SERVER + '/v3plus/video/search'
    var body = {'name': 'cat_list', 
                       'cat': req.params.categoryType, 
                       'page': req.params.pages};
    console.log('/api/category');

    // Check Redis and get from remote
    cacheAndGet(api, body, getJSON, function(json){
        res.send(json);
    });
 });




app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


