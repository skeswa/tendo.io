/*************************************** FILE DESCRIPTION *****************************************/

// This script describes routes concerning articles.

/*************************************** EXTERNAL IMPORTS *****************************************/

var _ = require("underscore");
var md5 = require("MD5");

/*************************************** INTERNAL IMPORTS *****************************************/

var logger = require("../../util/log"); // Our custom logging utility

/******************************************** MODULE **********************************************/

var generate = function (req, res) {
	var gameSessionId = req.param('id'); 
	var qr = qrcode(4, 'M');
	console.log('http://' + req.get('host') + '/game/controller/' + gameSessionId);
	qr.addData('http://' + req.get('host') + '/game/controller/' + gameSessionId);
	qr.make();
	res.send(200, qr.createImgTag());
}

/******************************************* EXPORTS **********************************************/

// This controller's HTTP routes
module.exports.routes = [{
    path: "/qr/generate",
    method: "POST",
    handler: generate
}];