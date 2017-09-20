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
    'be18f5854eaa4383bc5eed44c46e7438',
'66470c7c57d542ba9f155e937f67c650',
'7a654a62782a48d3966025b0ae3db9f4',
'09bb7420b92d44db8c8762ef9df3df42',
'643bbbaf559e4d6180bac4e2b85d2f24',
'161f7aadfe0942988851dac51e05aee5',
'67f31c2df7cc4017a8bcd2ce935f365d',
'12ca4e77767a42d49cb39ebbb3276dc1',
'6b1bd0bcbe2b4d7f8c9392b3698a0a04',
'ba69f21519024a11b7a6b55c5f5b7d87',
'11e5bdd6ee73411ba686b8809cb2e8ba',
'0ea84f850726413c8ffdda894e43c995',
'7e2d5aa6b774491a93c0c1383af27eca',
'b6ee9633784543c5a342748955b7b662',
'40fe821b981246679a900ffcbc467fec',
'17cf454e0a5540b7a59d39af85e0b50a',
'a3270bf4b4a9484a8e6192c9ba789e4f',
'018ef5b349774c2390575017e2478aa8',
'fd2ef79abb8c4bde9603a3ff4efa94fb',
'012dce78b9744c75b31d6aff38cb5e47',
'94f3507599ce4050a1790a70e47b5085',
'f157350d6d42444086fe5b4c504d8bd4',
'1ffc36d5f1374e6d90da3eb95f43a805',
'2062006811bd438e948ebd56ce22facb',
'bca1ff73a55d4758afcca25b98393f68',
'83cbd12479354ce3bd249fe4f1c66c32',
'4b731fc41bb64d2985d3ac79dee72334',
'122f47a06ea140278eba27abcdacc3c2',
'3152d1e20b6b4620922eecad3bde6817',
'a1a3326d7ac4410f87574a68abd8fa5f',
'997096726ae94b37becc3551f36fc00f',
'83bcb18d8f6548898e0ed5198f5d4278',
'f7cd1f6af66a48a8b78fdcc4f0cbe29d',
'6b98b2fed1bb4453aac49a41e7884ef0',
'b903b38fc81045ab939d5154748301b2',
'1267b2dca3094121a922c7180ac1e77c',
'd86a2dbb62194fe2bd6852aa0360b5e3',
'6837974782ea497cb30877eacb0ba354',
'7be9dad89a044ef18ec3536ee3e47411',
'f881c3577c844eb98f8c2fe10064b7aa',
'86c56c6189ce4438bb03b7cc1d632912',
'd9ac0a4ba7174297bdd92d0e878661ea',
'b2485e484ff844fa864c52089cca24fe',
'014cfe95d9a74ee8b10f5ca740f0a81c',
'b0b3a379fb19494ba719df2b7bcc93cd',
'dc96c1cba1314284bc956e7661acf278',
'234df650b1434ac2b8540b3adf49452c',
'8611445da6d848379e19b1b0c64911d8',
'e9bab37c6d014e169ee768818b0e64ea',
'976678768ff440669923e04499d7f36b',
'2e5eba5f0cab4f04a43b92eacdbe7eae',
'e90ed6a69270480d8f0dc59830c51246',
'27c3b73ada2c4e90a9d536c3e4c97b54',
'ecf82e4cd49e41d29a43eddd31afd222',
'7144b36854914db880f321a9481ab90d',
'acca2e21f9b64adab0ccef43ff4ae063',
'b6797dc67eb14f1c95aa567be7919d42',
'b474df8d6b08463e9f140443b53aa694',
'1b69e47b7919405a9c2894b924d6c2a9',
'5ddedfe4181f4447a863eda50becbee0',
'532612658b544f92bb31cf250d653957',
'be9c6ad2ad9d404a97c66eef2cbba4d4',
'c90c709d2a9643c5ab7cca041ad6a315',
'148acf95b56240b6a51b8ba78a4fe28a',
'4adaecb34b9e49bcae16e4a0890f9da2',
'9cb1010e255846beaecbeef4d7bda4bd',
'ec19261177ac44fd817d0705c0cfa2af',
'e9dca93ed2344b719bfa5cc8b1aa27ec',
'0eb30833c450422da0d9529d932de7be',
'd29c467f703341d3be57852b22269688',
'e723f2d485da4315bd05bb00f8997170',
'4eb15501dfc343368b2d1d8fb029e2cb',
'4272adc9c62844ea8e9146bb73e2592b',
'f2d7fd1ee258494e95c5acd87aa9ee12',
'25596dac76e244dc8a93438360ae2e16',
'e90a78adbd4f4c98ac08eb1623e624eb',
'27ca3f86166642579c8bf534c936fb00',
'93b33688bc514c348069e146dcba8fb1',
'0ff10164242f45b88a0b07df69aa8a79',
'4377ecd95f0448218d105ec5b845a48c',
'13a3ccf03cbf4dce97fad63cc199ea7a',
'84521dd4ba0f4f379ef9611d1fee8467',
'd7dba431fb8c46e3999ea78c203c4d22',
'29aab89d529442419ba1ff3542579ffb',
'73c32913dd314e40a669c710afb23a6c',
'2dae999e61a24136a98cbde21d81add2',
'9f4ecd8cf285414cad257ecb04f25d16',
'34979b93e98a439e9643616cb6d6bdca',
'54825dbb9b7a488b8fa63f58c78a5658',
'b839160970a14320bc57a7d6328e8eda',
'f8711232886e49c4b62e25fda957aedc',
'fbe20f52553e454ab9b255bc1090c8df',
'720e8938aec1493693206f6b457155b5',
'4f2d26cd90a9451b92ab71b96ca70c28',
'5fef07de50b247f198938e2c5ae610e7',
'5f8108072f184b8aa4db157b284d777c',
'729893ce56eb404a82b952cf846add72',
'4eb5f538139244d29b262bdaa94033e7',
'8139980f355540c99528deff94579ef5',
'ce335d6634e2471687f48c8a8b4a0085',
'74a34048da6247d7ad4d1a12a328a23e',
'09a8108d0f20423e9b524bf2a6f23049',
'0be26b9543d5412699628b6aaeea5570',
'391fc91a59174a96910bc6d200d563b2',
'f84fc0036d1b4336bcd8b8def7c6ab06',
'00a8ab731da14b89a8229d3f9fa6f620',
'48f768d5f8cd4bc0a005ce234de302f9',
'b061995cbda24c76b2f4de7c656aa2b3',
'37d1503e816b461daf8cff5955a03e1a',
'33fbc3bd0b0f4e0e8d305edbef3427f2',
'b2ee9bd42e7d4c8885b82f370e4768ae',
'a590bd80be6145c5ac17a1ea37607194',
'411e7001beda4039bb375f7c6b66d7d4',
'a6a68451f81a4e4db31ec99ae3005614',
'ec85c301db94458c9495cb4a505ab984',
'15623b2a6ddc496f96a889037d91f794',
'f361d413f57340d0a3ff012c520dbe2c',
'b5dde7747f4d40a2844da64fa7b7cd45',
'2b542d48126a48bf9a9b71fc4b5f1e0e',
'a01b940c6e4f4118be6df150aa4c4c58',
'b7e544ff384e4aac9d63936b6ba19759',
'1959f65fa49a41d6bb1036a2fd3edc64',
'feff145625694a6d8222ed2b245ed698',
'2ced1a5f3f5444268c90289838a15b34',
'683ca2812e06435083b6844aaedf1f44',
'466fd20703814f49b4b863883acc95df',
'902b8c7c21ef41868ab0e0850f789295',
'fb98f0effcd24128bceb2d9a436247cf',
'006db18ac91c4f4fa7c38f5954fea365',
'fbb86c3e30974d2d9cc404c71b98423f',
'86020f000a164b76bd6891e16a29c92b',
'7278a1f3cb794bbbaf319dad37ca5405',
'f8414a876bba471db371d3853fe758ee',
'5d1340191c544d39a4af1b145323f699',
'aaa934a336f5491897677856888db27d',
'dea56906858d40529061e185b04e3032',
'5c3e21185607409ab791281ff9b9cb22',
'4922257746d24057a6b6892ecd6a536c',
'323eaa51180444a49b359ce9f8e29364',
'a05ba8b549d34801b97fd28af5909aff',
'aa621769055a40dcb5adb2894902af0a',
'9863d95014d24a5a90aee4183e1d0a23',
'b8bdbbd17e7845cdac8da46019462824',
'61ddd59c2ea74a559e16c00cdeb0ac61',
'a194fbc673264a2fafaa9f8044219c88',
'7b51959f41c54a3bacda60f868ffd903',
'9b84ef9650244dd596cdb275fc10efdd',
'e671a5d47b7443b1aab48cf35ff316dd',
'8e68a3bd62bf4deaabf42978f7cf38ed',
'f2096b25e1af4c2a9c647a95387db71d',
'2be89d92980a46988223b47276237849',
'c9e68a59391a4f74af116c40fb2dfba8',
'ac45b8df48fc4778b82bb1d396d53faf',
'c624ea6c7b1840fd96290beaaea9d30d',
'12b275bf67a04c169cbdd590867255b6',
'a5b92623ddde48b78ecdf152d28a9152',
'6f71a33046f84cb3a3eb479daf136dff',
'8103b63948ca4d34846d96472a5dc2b6',
'63bbc61258a64de8abdcbc57f56c3f06',
'bbc3c76fe1da43bab92313d13fe67c33',
'e282d53933a54f0fb7283af4bd95087f',
'631515874df54e7f9ce8e089a57ebe1c',
'c24f1190be0b445b95b376e587ab7fc3',
'61401f66105e4158b73d86018aa4fe1c',
'6d8645b0b58f482b835ec48f340135b4',
'f7381fab61ad4252b5d00dcd26594e78',
'5ecd28ab33184895aac73cd75da50b2f',
'681a891e963d4ce18297653555fff046',
'98a6e235ba3e4e64801871cac8c0e58f',
'9689e7ca7edf4fc0ba280a9a9c60ccbe',
'8dd9dcfcde00457190912e5a01202b8f',
'c9f2a171171d423fa12eed3f6d845773',
'70778fb380c3493fae6d46657a1b4e6f',
'ef460c5a7b0d4c0e814a89b7413f9b4f',
'e12b11fcebf2462f84a1ff5910792d1a',
'dab6c0fc4c2741b9bc9963a964f0e6fc',
'c407a7d33f464421b545424313620f8f',
'c6eb755f0bfa4464be1721c4c9c3bbad',
'562e752eab3547119d5bbe870f7f8f99',
'a6c054ca890343039e12391af63e07d8',
'8a78aa398a6f44849f731d052a4f139d',
'd11036e7ac84478b928a95b736d3b7e5',
'43f70bd12a2b4780b1d46d5c2f4cd454',
'736a7f64f545415b9b6c49d91d438074',
'7b3b76dfc1ab4f73aa18d7e462048a5b',
'7b8630f2d6784928be712e1c58d54d5b',
'f1359645d0e6455686a26369b166421b',
'd08ebb7acaab4f37a744f04f49e7a05b',
'37bf0547766c456a8b440bb27351d793',
'2aa1cf6a16084af1a7df353a91fb1f2b',
'df3ab4f842f64f7391bc1ec0d54bce85',
'700af58e1a9a49e7a4ff23e9c7e25333',
'3d41e6db911f42ad876e8d05b7c76a1e',
'49f8058b9b814254a78b77f5c9daef2d',
'ee223ca522d1431a99b2d9f5776f0741',
'8d90d981109346bdad8efa166da357b0',
'5102c1fe720b4450a184e9ed9fed4b24',
'b3a8517c40c74991a2e8ee23063e7a66',
'f51454ad121448dfac920319c7274419'
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


