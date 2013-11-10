// Generates random 32 letter string
var makeNewPeerId = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 32; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};
// Make the communicator
var doKeyDown = function(keyCode) {
    nes.keyboard.keyDown({ keyCode: keyCode });
};
var doKeyUp = function(keyCode) {
    nes.keyboard.keyUp({ keyCode: keyCode });
};
var signal = {
    a: function(player, val) {
        var kc = (player === 1) ? 88 : 103;
        if (val === 0) doKeyUp(kc);
        else doKeyDown(kc);
    },
    b: function(player, val) {
        var kc = (player === 1) ? 90 : 105;
        if (val === 0) doKeyUp(kc);
        else doKeyDown(kc);
    },
    up: function(player, val) {
        var kc = (player === 1) ? 38 : 104;
        if (val === 0) doKeyUp(kc);
        else doKeyDown(kc);
    },
    down: function(player, val) {
        var kc = (player === 1) ? 40 : 98;
        if (val === 0) doKeyUp(kc);
        else doKeyDown(kc);
    },
    left: function(player, val) {
        var kc = (player === 1) ? 37 : 100;
        if (val === 0) doKeyUp(kc);
        else doKeyDown(kc);
    },
    right: function(player, val) {
        var kc = (player === 1) ? 39 : 102;
        if (val === 0) doKeyUp(kc);
        else doKeyDown(kc);
    },
    select: function(player, val) {
        var kc = (player === 1) ? 17 : 99;
        if (val === 0) doKeyUp(kc);
        else doKeyDown(kc);
    },
    start: function(player, val) {
        var kc = (player === 1) ? 13 : 97;
        if (val === 0) doKeyUp(kc);
        else doKeyDown(kc);
    }
};

angular.module('mean.system').controller('ConsoleController', ['$scope', 'Global', '$http',
    function($scope, Global, $http) {

        console.log(game_data);

        JSNES.UIDelegate.load("http://pooter.sandile:3000/roms/download/"+game_data);
        
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

                // get qr code
                console.log("/qr/generate/"+gameSession);

                $http({
                    url: "/qr/generate/"+gameSession,
                    method: "GET",
                })
                .success(function(data, status) {
                    $('#QR').html(data);
                })
                .error(function(data, status) {
                  alert("failed");
                  console.log(data);
                  console.log(status);
                });

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
                // Print the input
                console.log("Player #" + player + ": " + (value ? "keydown" : "keyup") + " on button '" + buttonId + "'.");
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