angular.module('mean.system').controller('ConsoleController', ['$scope', 'Global',
    function($scope, Global) {
        $scope.global = Global;
        // Build peer object
        var peer = new Peer({
            host: window.location.hostname,
            port: 3333,
            debug: 1
        });
        // Make the communicator
        var signal = {
            a: function(player, val) {
                // TODO 
                $.event.trigger({
                    type: (val ? "keydown" : "keyup"),
                    which: (player === 1 ? 88 : 103)
                });
            },
            b: function(player, val) {
                // TODO 
                $.event.trigger({
                    type: (val ? "keydown" : "keyup"),
                    which: (player === 1 ? 90 : 105)
                });
            },
            up: function(player, val) {
                // TODO 
                $.event.trigger({
                    type: (val ? "keydown" : "keyup"),
                    which: (player === 1 ? 38 : 104)
                });
            },
            down: function(player, val) {
                // TODO 
                $.event.trigger({
                    type: (val ? "keydown" : "keyup"),
                    which: (player === 1 ? 40 : 98)
                });
            },
            left: function(player, val) {
                // TODO 
                $.event.trigger({
                    type: (val ? "keydown" : "keyup"),
                    which: (player === 1 ? 37 : 100)
                });
            },
            right: function(player, val) {
                // TODO 
                $.event.trigger({
                    type: (val ? "keydown" : "keyup"),
                    which: (player === 1 ? 39 : 102)
                });
            },
            select: function(player, val) {
                // TODO 
                $.event.trigger({
                    type: (val ? "keydown" : "keyup"),
                    which: (player === 1 ? 17 : 99)
                });
            },
            start: function(player, val) {
                // TODO 
                $.event.trigger({
                    type: (val ? "keydown" : "keyup"),
                    which: (player === 1 ? 13 : 97)
                });
            }
        };
        var peerId = peer.id;
        var gameSession = null;
        // Register the peer id
        var request = $.ajax({
            url: "/game/join",
            data: {
                clientType: "console",
                peerId: peerId
            },
            type: "POST",
            success: function(response, textStatus, jqXHR) {
                console.log("resp: " + response);
                gameSession = JSON.parse(response);
                // Time to register handlers
                peer.on("connection", onConnection);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("Hooray, it worked!");
            }
        });
        // Make the the WebRTC function registrations
        var onConnection = function(connection) {
            var peerType = null;
            connection.on("open", function() {
                console.log("connection opened with peer: " + connection.peer);
            });
            connection.on("data", function(data) {
                console.log("data: " + data);
                if (!peerType) {
                    // They're announcing peer type
                    peerType = data;
                    return;
                }
                if (peerType === "controller") {
                    // Its a controller
                    data = JSON.parse(data);
                    if (data.a === 0 || data.a === 1) signal.a(data.player, data.a);
                    if (data.b === 0 || data.b === 1) signal.b(data.player, data.b);
                    if (data.up === 0 || data.up === 1) signal.up(data.player, data.up);
                    if (data.down === 0 || data.down === 1) signal.down(data.player, data.down);
                    if (data.left === 0 || data.left === 1) signal.left(data.player, data.left);
                    if (data.right === 0 || data.right === 1) signal.right(data.player, data.right);
                    if (data.start === 0 || data.start === 1) signal.start(data.player, data.start);
                    if (data.select === 0 || data.select === 1) signal.select(data.player, data.select);
                }
            });
            connection.on("close", function() {
                console.log("connection closed");
            });
        };
    }
]);