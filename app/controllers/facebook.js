/*************************************** FILE DESCRIPTION *****************************************/

// This script describes routes concerning articles.

/*************************************** EXTERNAL IMPORTS *****************************************/

var querystring = require('querystring');
var request = require('request');
var url = require('url');

const FACEBOOK_APP_ID = '357248821077904';
const FACEBOOK_APP_SECRET = '199a615d604134f102a1d8cd765d376c';
const REDIRECT_URI = 'http://localhost:3000/facebook/callback';
const GRAPH_URL = 'https://graph.facebook.com/me?';

/*************************************** INTERNAL IMPORTS *****************************************/

var logger = require("../../util/log"); // Our custom logging utility

/******************************************** MODULE **********************************************/

var loginFacebookUser = function(req, res){
	var authUrl = 'https://www.facebook.com/dialog/oauth?' + querystring.stringify({client_id: FACEBOOK_APP_ID, redirect_uri: REDIRECT_URI});
	res.redirect(authUrl);
}

var facebookCallback = function(req, res){
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var code = query.code;
	var tokenUrl = 'https://graph.facebook.com/oauth/access_token?' + querystring.stringify({client_id: FACEBOOK_APP_ID, redirect_uri: REDIRECT_URI, client_secret: FACEBOOK_APP_SECRET, code: code});
	request(tokenUrl, function(err, response, body) {
		if(err) throw err;
		var accessToken = querystring.parse(body).access_token;
		req.session.fbtoken = accessToken;
		request(GRAPH_URL + querystring.stringify({access_token: accessToken, fields: 'picture,name'}), function(err, response, body) {
			if(err) throw err;
			res.send(body);
		});
	});
}

/******************************************* EXPORTS **********************************************/

// This controller's HTTP routes
module.exports.routes = [{
    path: "/facebook/login",
    method: "GET",
    handler: loginFacebookUser
},
{
    path: "/facebook/callback",
    method: "GET",
    handler: facebookCallback
}];