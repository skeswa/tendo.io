// Generates random 32 letter string
var makeNewPeerId = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 32; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};
// Make the communicator
var logSignal = function(msg) {
    $("#activity-log").append("<span class='log-item'>" + msg +"</span>");
}
var signal = {
    a: function(player, val) {
        logSignal("Player " + player + ": A " + (val ? "keydown" : "keyup"));
        $.event.trigger({
            type: (val ? "keydown" : "keyup"),
            which: (player === 1 ? 88 : 103)
        });
    },
    b: function(player, val) {
        logSignal("Player " + player + ": A " + (val ? "keydown" : "keyup"));
        $.event.trigger({
            type: (val ? "keydown" : "keyup"),
            which: (player === 1 ? 90 : 105)
        });
    },
    up: function(player, val) {
        logSignal("Player " + player + ": A " + (val ? "keydown" : "keyup"));
        $.event.trigger({
            type: (val ? "keydown" : "keyup"),
            which: (player === 1 ? 38 : 104)
        });
    },
    down: function(player, val) {
        logSignal("Player " + player + ": A " + (val ? "keydown" : "keyup"));
        $.event.trigger({
            type: (val ? "keydown" : "keyup"),
            which: (player === 1 ? 40 : 98)
        });
    },
    left: function(player, val) {
        logSignal("Player " + player + ": A " + (val ? "keydown" : "keyup"));
        $.event.trigger({
            type: (val ? "keydown" : "keyup"),
            which: (player === 1 ? 37 : 100)
        });
    },
    right: function(player, val) {
        logSignal("Player " + player + ": A " + (val ? "keydown" : "keyup"));
        $.event.trigger({
            type: (val ? "keydown" : "keyup"),
            which: (player === 1 ? 39 : 102)
        });
    },
    select: function(player, val) {
        logSignal("Player " + player + ": A " + (val ? "keydown" : "keyup")); 
        $.event.trigger({
            type: (val ? "keydown" : "keyup"),
            which: (player === 1 ? 17 : 99)
        });
    },
    start: function(player, val) {
        logSignal("Player " + player + ": A " + (val ? "keydown" : "keyup"));
        $.event.trigger({
            type: (val ? "keydown" : "keyup"),
            which: (player === 1 ? 13 : 97)
        });
    }
};

angular.module('mean.system').controller('ConsoleController', ['$scope', 'Global',
    function($scope, Global) {
        $scope.global = Global;
        // Build peer object
        peerId = makeNewPeerId();
        var peer = new Peer(peerId, {
            host: window.location.hostname,
            port: 3333,
            debug: 1
        });
        var gameSession = null;
        // Register the peer id
        var request = $.ajax({
            url: "/game/join",
            data: {
                clientType: "console",
                peerId: peerId,
                forceNew: true
            },
            type: "POST",
            success: function(response, textStatus, jqXHR) {
                console.log(response);
                gameSession = response.id;
                // Time to register handlers
                peer.on("connection", onConnection);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("FAIL");
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
        // Make the the WebRTC function registrations
        var onConnection = function(connection) {
            var peerType = null;
            connection.on("open", function() {
                console.log("connection opened with peer: " + connection.peer);
            });
            connection.on("data", function(data) {
                console.log("data: ");
                console.log(data);
                var buttonId = data.buttonId;
                var player = data.player;
                var value = data.value;
                // Pipe to the emulator
                switch (buttonId) {
                    case "a":
                    case "b":
                    case "x":
                    case "y":
                    case "up":
                    case "down":
                    case "left":
                    case "right":
                    case "select":
                    case "start":
                        if (signal[buttonId]) signal[buttonId](player, value);
                        break;
                    default:
                        console.log("UNSUPPORTED BUTTON_ID RECEIVED: " + buttonId);
                        break;
                }
            });
            connection.on("close", function() {
                console.log("connection closed");
            });
        };
    }
]);