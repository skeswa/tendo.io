var express = require('express');
var http = require('http');
var qrcode = require('qrcode-npm').qrcode;
var md5 = require('MD5');
var path = require('path');

var app = express();
app.engine('html', require('ejs').renderFile);

const SERVER_ADDR = 'localhost:7373'

app.use(express.cookieParser());
app.use(express.session({
    secret: 'secret_key',
    store: express.session.MemoryStore({
        reapInterval: 60000 * 10
    })
}));
app.use(express.bodyParser());

app.get('/generateqr/:id', function(req, res){
	var gameId = req.param('id'); 
	var qr = qrcode(4, 'M');
    console.log('http://' + req.get('host') + '/game/' + gameId);
	qr.addData('http://' + req.get('host') + '/game/' + gameId);
	qr.make();
	res.send(200, qr.createImgTag());
});

http.createServer(app).listen(7373);