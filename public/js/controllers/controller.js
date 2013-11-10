var makeNewPeerId = function() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 32; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

angular.module("mean.system").controller("ControllerController", ["$scope", "Global",
  function($scope, Global) {
    var peerId = makeNewPeerId();
    console.log("peerId: " + peerId);
    var peer = new Peer(peerId, {
      host: window.location.hostname,
      port: 3333,
      debug: 1
    });

    peer.on("error", function(err) {
      console.log("PEER SHIT THE BED: " + err);
    });

    var connection = null;
    var playerNumber = null;
    // Do registration
    $.ajax({
      url: "/game/join",
      data: {
        clientType: "controller",
        peerId: peerId,
        gameSessionId: gameSessionId
      },
      type: "POST",
      success: function(response, textStatus, jqXHR) {
        console.log(response);
        playerNumber = response.controllerIndex + 1;
        console.log("PLAYER NUMBER OF THIS CONTROLLER IS: " + playerNumber);
        var consolePeerId = response.consolePeerId;
        console.log("CONSOLE PEER ID OF THIS GAME SESSION IS: " + consolePeerId);
        connection = peer.connect(consolePeerId, {
          label: "PLAYER " + playerNumber
        });
        connection.send("controller");
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log("FAIL");
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      }
    });

    var recenterController = function() {
      $("body").css("paddingTop", ($(window).height() - 240) / 2.0);
    };
    $(window).resize(recenterController);
    $(recenterController);

    var signal = function(buttonId, value) {
      var payload = {
        player: playerNumber,
        buttonId: buttonId,
        value: value
      };
      console.log(payload);
      if (connection) {
        connection.send(payload);
      } else {
        console.log("Could not send because connection is blank NUB.");
      }
    };

    $scope.clickButton = function(button) {
      signal(button, 1);
    };

    $scope.releaseButton = function(button) {
      signal(button, 0);
    };
  }
]);