angular.module("mean.system").factory('TendoService', function($rootScope, $http, $location) {
  var sharedService = {};

  // Create a new Peer with our demo API key, with debug set to true so we can
  // see what's going on.
  sharedService.peer1 = new Peer({
    key: 'lwjd5qra8257b9',
    debug: 3
  });
  // Create another Peer with our demo API key to connect to.
  sharedService.peer2 = new Peer({
    key: 'lwjd5qra8257b9',
    debug: 3
  });

  // The `open` event signifies that the Peer is ready to connect with other
  // Peers and, if we didn't provide the Peer with an ID, that an ID has been
  // assigned by the server.
  sharedService.peer1.on('open', function(id) {
    sharedService.peerId1 = id;

    var c = sharedService.peer2.connect(sharedService.peerId1);
    c.on('data', function(data) {
      // When we receive 'Hello', send ' world'.
      console.log(data);
      c.send(' peer');
    });
  });

  // Wait for a connection from the second peer.
  sharedService.peer1.on('connection', function(connection) {
    // This `connection` is a DataConnection object with which we can send
    // data.
    // The `open` event firing means that the connection is now ready to
    // transmit data.
    connection.on('open', function() {
      // Send 'Hello' on the connection.
      connection.send('Hello,');
    });
    // The `data` event is fired when data is received on the connection.
    connection.on('data', function(data) {
      // Append the data to body.
      console.log(data);
    });
  });

  return sharedService;
});
angular.module("mean.system").controller("ControllerController", ["$scope", "Global", "TendoService",
  function($scope, Global, TendoService) {
    peer = new Peer({
      key: 'lwjd5qra8257b9',
      debug: 3
    });

    var recenterController = function() {
      $("body").css("paddingTop", (function() {
        console.log($("window").height())
        return ($(window).height() - 240) / 2.0;
      })());
    };
    $(window).resize(recenterController);
    $(recenterController);

    //  on connect
    var c = TendoService.peer2.connect(TendoService.peerId1);

    //    connect
    //      enable click listeners for controller buttons
    //        click listeners call connection.send()

    c.on('data', function(data) {
      // When we receive 'Hello', send ' world'.
      console.log(data);
      c.send(' peer');
    });

    $scope.clickButton = function(button) {
      send_to_console(button,1);
    }

    $scope.releaseButton = function(button) {
      send_to_console(button,0);
    }

    var send_to_console = function(button,state){
      var data = [];
      data[button] = state;
      console.log(data);
    }

  }
]);