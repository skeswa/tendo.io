/*************************************** FILE DESCRIPTION *****************************************/

// This script describes routes concerning articles.

/*************************************** EXTERNAL IMPORTS *****************************************/

var _ = require("underscore");
var md5 = require("MD5");

/*************************************** INTERNAL IMPORTS *****************************************/

var logger = require("../../util/log"); // Our custom logging utility

/******************************************** MODULE **********************************************/

// Firstly, load the model
var sessionMap = {};

var newGameSession = function(userAgent) {
    var key = md5(userAgent + "/" + (new Date()).getTime() + "/" + Math.random()).substring(0,8);
    while (sessionMap[key]) key = md5(key)
    sessionMap[key] = {
        id: key
    };
    return key;
};

var joinSession = function(req, res) {
    // Get the type
    var gameClientType = req.param("clientType");
    if (!gameClientType) {
        res.send(400, "The 'clientType' parameter was null.");
        return;
    } else if (!(gameClientType === "console" || gameClientType === "mirror" || gameClientType === "controller")) {
        res.send(400, "The 'clientType' parameter must be 'console', 'mirror' or 'controller'. Instead it was '" + gameClientType + "'.");
        return;
    }
    // Check the peer id
    var peerId = req.param("peerId");
    if (!peerId) {
        res.send(400, "The 'peerId' parameter was null.");
        return;
    }
    // Read the session
    var gameSessionId;
    if (!req.param("forceNew")) gameSessionId = req.param("gameSessionId") || req.session.gameSessionId;
    if (!gameSessionId) {
        // Make a new one since this guy doesn't have one
        gameSessionId = newGameSession(req.headers["user-agent"]);
        req.session.gameSessionId = gameSessionId;
    }
    // Get the session
    var session = sessionMap[gameSessionId];
    if (!session) {
        res.send(500, "Could not join session; it was non-existent.");
        return;
    }
    // Do the register
    if (gameClientType === "console") session.consolePeerId = peerId;
    else if (gameClientType === "mirror") {
        var mirrors = session.mirrorPeerIds;
        if (!mirrors) {
            mirrors = session.mirrorPeerIds = [];
        }
        if (mirrors.indexOf(peerId) == -1) mirrors.push(peerId);
    } else {
        // Controller
        var controllers = session.controllerPeerIds;
        if (!controllers) {
            controllers = session.controllerPeerIds = [];
        }
        if (controllers.indexOf(peerId) == -1) controllers.push(peerId);
        session.controllerIndex = controllers.indexOf(peerId);
    }
    // Call mom - tell her we're ok
    res.json(200, session);
};

var getControllerIndex = function(req, res) {
    var gameSessionId = req.session.gameSessionId;
    if (!gameSessionId) {
        res.send(400, "The 'gameSessionId' parameter was null.");
        return;
    }
    var peerId = req.param("peerId");
    if (!peerId) {
        res.send(400, "The 'peerId' parameter was null.");
        return;
    }
    // Get the session
    var session = sessionMap[gameSessionId];
    if (!session) {
        res.send(500, "Could not get the session; it was non-existent.");
        return;
    }
    // Get the controllers
    var controllerPeerIds = session.controllerPeerIds;
    if (!controllerPeerIds) {
        res.send(500, "Could not get the controllers in session; because there are none.");
        return;
    }
    // Get them controllers, do a match
    for (var i = 0; i < controllerPeerIds.length; i++) {
        if (controllerPeerIds[i] === peerId) {
            res.send(200, (i + 1));
            return;
        }
    }
    res.send(200, -1);
};

var getConsolePeerId = function(req, res) {
    var gameSessionId = req.session.gameSessionId;
    if (!gameSessionId) {
        res.send(400, "The 'gameSessionId' parameter was null.");
        return;
    }
    // Get the session
    var session = sessionMap[gameSessionId];
    if (!session) {
        res.send(500, "Could not get the session; it was non-existent.");
        return;
    }
    res.send(200, session.consolePeerId);
};

var getMirrorPeerIds = function(req, res) {
    var gameSessionId = req.session.gameSessionId;
    if (gameSessionId) {
        res.send(400, "The 'gameSessionId' parameter was null.");
        return;
    }
    // Get the session
    var session = sessionMap[gameSessionId];
    if (session) {
        res.send(500, "Could not get the session; it was non-existent.");
        return;
    }
    res.json(200, session.getMirrorPeerIds || []);
};

var getControllerPeerIds = function(req, res) {
    var gameSessionId = req.session.gameSessionId;
    if (!gameSessionId) {
        res.send(400, "The 'gameSessionId' parameter was null.");
        return;
    }
    // Get the session
    var session = sessionMap[gameSessionId];
    if (!session) {
        res.send(500, "Could not get the session; it was non-existent.");
        return;
    }
    res.json(200, session.controllerPeerIds || []);
};

var renderController = function(req, res) {
    var gameSessionId = req.param("gameSessionId");
    if (!gameSessionId) {
        res.send(400, "The 'gameSessionId' parameter was null.");
        return;
    }
    // Get the session
    var session = sessionMap[gameSessionId];
    if (!session) {
        res.send(500, "Could not get the session; it was non-existent.");
        return;
    }
    req.session.gameSessionId = gameSessionId;
    // 
    res.redirect('/facebook/login');
};

/******************************************* EXPORTS **********************************************/

// This controller's HTTP routes
module.exports.routes = [{
    path: "/game/join",
    method: "POST",
    handler: joinSession
}, {
    path: "/game/console",
    method: "GET",
    handler: getConsolePeerId
}, {
    path: "/game/mirrors",
    method: "GET",
    handler: getMirrorPeerIds
}, {
    path: "/game/controllers",
    method: "GET",
    handler: getControllerPeerIds
}, {
    path: "/game/controller/:gameSessionId",
    method: "GET",
    handler: renderController
}, {
    path: "/game/controllerIndex",
    method: "GET",
    handler: getControllerIndex
}, {
    path: "/game",
    method: "GET",
    handler: function(req, res) {
        res.render("app", {});
    }
}];