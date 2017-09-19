var express = require('express');
var compression = require('compression');
var request = require('request');
var path = require('path');
var parser = require('body-parser');
var md5 = require('md5')
var redis = require('redis')
var mongoose = require('mongoose')
var app = express();
var client = redis.createClient(process.env.REDIS_URL);


/**
 * Configuration
 */
app.set('port', (process.env.PORT || 5000));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
if (process.env.NODE_ENV == 'production') {
    app.use(function(req, res, next) {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect('https://' + req.hostname + req.url);
        }
        next();
    });
}
app.use(compression());
app.use(express.static(__dirname + '/frontend/build'));
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));


/**
 * Constant Variable
 */
SERVER = "http://api.rr.tv";
SECRET_KEY = "clientSecret=08a30ffbc8004c9a916110683aab0060";
TOKENS = [
    'e1367d42fdc549d28e13f29accf638d7',
    '810e6245ef1a40238f3aa54cd3a9762d',
    '14c3e90af57c42c2a913695dcaa659f7',
    'd70689b8f2524293b2c54c07b2838ef7',
    '0b6225b4fdfe4713a31f3ae2be2742ff',
    '9d9fc124b51e4428b4c4dcaee4184dd9',
    '8efdbeaee5644aa8b48401fbd6ba94c5',
    '7c9488139b594bec8113a327afd855d1',
    '481a93b58a07488f9d8ceb9b33589874',
    'becd2badd58b4080b02cfa010dfff723',
    'ae6c6222f660459782544976df7b8cad',
    'a1e1ce23458a40bf86b2438287d63297',
    'b4e5a035fb17477b9989b799e0125c78',
    'cb81694285604e1ab944ecd7e65124e0',
    '9fe767979525488086195735fa7e1cb6',
    'd3f58a16614c48818a9db23764c368f3',
    '33f2afcc77674613a69951a053ba6981',
    '85cb13490e4c4b5e84461569ded80a3b',
    '06726acd355c42bfbd4bb4dc8410a4a7',
    '56bab106805746ecaa6d8e423496df73',
    '10cf2f0a767044ec86bbd157ab55d8b1',
    '0d37cb6554be46a4b5b170fa33f4c881',
    '1faac5bcecac454198587fe70b986011',
    '723fddfcfe724ed4a71d8c0ca604cd25',
    '075d75266423462b907db8d05cabf022',
    '06cc75b7d73142029b1703cdf6b04ea5',
    '5b683e3970e34aa089dc140605a29c2c',
    '2e47c2e90999485480ed9068160a6f7a',
    '337c63f345974dba918ffaa8756ba556',
    '8f007a0a624549159bbd30ed674d0ed9',
    'a93db027c2d44e799614b6151ab44313',
    '4ddebd6b2afe40e8bd383dc20bd4751c',
    '12338c99eae149d0843cbe5536b3a2ac',
    '4c5a498d291849229b1eeb58c03cd836',
    'a24b9830dbe94cbda494e5d2133b227d',
    '4de125f38b214553a327b1bfa262ff64',
    '354d0822c54244ffa3c444260b76f8fb',
    '869a85dcf1f54565a78d1e8a9762e041',
    'c5a35ffd718243f0a5936c1b9282e071',
    'dd2b3401a1b14e4a95d5a1ba446897be',
    '39b1b4b8096a4ae5b5124c124efa4703',
    '9e92792514564ce0a449c7807bb549d4',
    'f79860eb56eb4ebe87951535e8bfe783',
    'ba31e378f0504818b08c1579c1ca9255',
    'fa3d96d7c3c74c7c9d57f784d85626d1',
    'e38dd39757d5469cb993cac08b51d120',
    '1f1f05b308f046e9886108881be390ce',
    '7bd4a749ad52421f96e973b345daab11',
    '6767ba1b1f66470cadb03f74fa493efa',
    '7e2b0bda81e44aa1bee895f46da95208',
    '9d2325e2199f4698bf4604dafeaa498c',
    '1352de07641a47249bfc32cd21d0836e',
    'e64ce9d7fc3d4162a4a4634a2df179f6',
    'bee4237219e34a52958a69ca6511fcf5',
    '07a29a5c8c814a648ef9dd7e60ba0c13',
    'e27e698a5e774f8caa8d0730e1a21ef1',
    'eb135492ae194ad1a1ad029f0fd3528e',
    '8cc6a3306e8f4c1e99737e93aa754fc0',
    'c73f204483ce453b8a8ad912c31555aa',
    '4aaa0c41b8ac4391aee6b322bcb464c0',
    '935327ee07a2466e928dbe29ca16c8e9',
    '556dbd67a1854d14a3d3ac2d65a61043',
    '74cc595343a04cb29a3dea5e66617e11',
    'f16552a0c5f5492694c67baaa22cbd6d',
    'e55cfc7950e94e5391a66760bc794584',
    'cd972440932a44b0b461563ea97ec465',
    'e50242daeda645779f5d9d0180eb803d',
    '30e26f8979194ec68893cbd69af2ed30',
    'e2152bbb32a54fb9aedba3dd3ff5acab',
    'd1a855099d79418295f361d18fcf2d1b',
    '56e1ac93687347a1b6769c1d44899029',
    '435fd6c930f14d09926963179048d8e1',
    '2001b6012b0f4acaa34b5270d59d252b',
    '35d85d40d6384cef836ffcd707bb6034',
    '4cb9566a4df94fa889523e6c5eb15079',
    'd9842d53f983495c93353accb2d1b16f',
    '73f1360749f0449782db524e4d08c613',
    '641e91f0c64f41f8b71b68c64af44cea',
    '1c41f40992dd450a9d7e0ecd4a8e66d8',
    '18d316377c694cc0a74f8f7e90d1a601',
    'ab8ceb3671034456a635380d2eeb834d',
    'f8424f7681834809979421cd15ad5d5d',
    'c046a51a4dfb4f96bdebefc46b94bb5c',
    '12fcb34cd88741638562b0668b52118c',
    'eda42b64dc6f4b1c90c22123463a049d',
    '191e8e3bdc824ac5ad5f34bd456f41c3',
    '93a3a04c16a24b1f9ff0e303eca71945',
    'fac925fd675b4bce8e30a32537a3f6ba',
    '61a433a52efe4a509526431f3b3a2f27',
    '427c892d917f4d90815828eb67ffdd89',
    'ce11a74392a9449a8cbde57441cb2ebc',
    '43d3386b87ba4525a8cbe44c7677fe4f',
    '84a7ae040bf340a99ab26b014ee5afae',
    'e25c4892fbc54204b360e8ed0124cb8d',
    '7c3d678be7464fffbab4f709eda5eff6',
    '09a83dfedab744ed97a5a65510118dad',
    'f82db7fa6fda446a83e507e6ed65017c',
    '995212037e6947d88a44339d6a0ab6ce',
    '08c6331bf6f141e0af31ae690d1f8bd1',
    'ef1dcca5a3d64f4494b65571fa04c35c',
    '73d56467588144e2865d610d811543ca',
    'faf4ff0a4265474f98768f552a0fdb45',
    '1fc53ded699542cb9a3e30727661aac3',
    '0f77516b185e48ce88fc113155860ade',
    '5afeccf22e1543138132ceea3b0445b4',
    'fd9ebc40dea54ae68e675926e4ac02c5',
    '054bf02ac9ca42049bc2bb6a7f4009e7'
];

Token_iterator = 0;
FAKE_HEADERS = {
    "clientType": "android_%E8%B1%8C%E8%B1%86%E8%8D%9A",
    "clientVersion": "3.5.3.1",
    "deviceId": "861134030056126",
    "token": "ed475779da3f42ba9f133bd45913c92b",
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
function cacheAndGet(key, api, body, getter, callback) {
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
                // Expire after half hours
                client.expire(key, 3600);
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
    var key = api + JSON.stringify(req.params.title);
    cacheAndGet(key, api, body, getJSON, function(json){
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
    var key = api + JSON.stringify(req.params.seasonId);
    cacheAndGet(key, api, body, getJSON, function(json){
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
    
    // round-robin tokens to avoid ban
    FAKE_HEADERS['token'] = TOKENS[(Token_iterator++)%TOKENS.length];
    console.log(FAKE_HEADERS['token']);

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
    console.log(md5(key))
    console.log('/api/m3u8/', req.params.episodeSid)

    // Check Redis cache first
    var key = api + JSON.stringify(req.params.episodeSid);
    console.log(key);

    client.exists(key, function(err, reply) {
        if (reply === 1) {
            client.get(key, function(err, reply) {
                res.send(reply);
            });
        } else {
            
            // Fetch remote data and set k,v in callback
            getJSON(api, body, function(json) {
                res.send(json);
                console.log(json)
                client.set(key, json);
                client.expire(key, 3500);
            }, headers); 
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
    var key = api;
    cacheAndGet(key, api, body, getJSON, function(json){
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
    var key = api;
    cacheAndGet(key, api, body, getJSON, function(json){
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
    var key = api;
    cacheAndGet(key, api, body, getJSON, function(json){
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
    var key = api + JSON.stringify(req.params.albumId);
    cacheAndGet(key, api, body, getJSON, function(json){
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
    var key = api + JSON.stringify(req.params.categoryType) + JSON.stringify(req.params.pages) ;
    cacheAndGet(key, api, body, getJSON, function(json){
        res.send(json);
    });
 });

/**
 * wildcard
 */
app.get('*', function (request, response){
  console.log(path.resolve(__dirname, 'frontend/build', 'index.html'));
  response.sendFile(path.resolve(__dirname, 'frontend/build', 'index.html'))
})


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


