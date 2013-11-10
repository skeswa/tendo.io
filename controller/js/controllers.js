/*requires 
jquery
googlemaps api
*/

var tendoModule = angular.module('tendoModule', []);
tendoModule.factory('tendoSharedService', function($rootScope, $http, $location){
    var sharedService = {};

    // Create a new Peer with our demo API key, with debug set to true so we can
    // see what's going on.
    sharedService.peer1 = new Peer({ key: 'lwjd5qra8257b9', debug: 3});
    // Create another Peer with our demo API key to connect to.
    sharedService.peer2 = new Peer({ key: 'lwjd5qra8257b9', debug: 3});

    // The `open` event signifies that the Peer is ready to connect with other
    // Peers and, if we didn't provide the Peer with an ID, that an ID has been
    // assigned by the server.
    sharedService.peer1.on('open', function(id){
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

tendoModule.controller('game', game);
tendoModule.controller('main', main);

///generatorqr/id

tendoModule.config(
  ['$routeProvider', 
    function($routeProvider) {
      $routeProvider.
        when('/', {templateUrl: '../main.html',   controller: main}).
        when('/game', {templateUrl: '../index.html',   controller: game}).
        otherwise({redirectTo: '/'});
    }
  ]
);

tendoModule.config(
    ['$locationProvider',
      function($locationProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
      }
    ]
  );

//$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

function game($scope, tendoSharedService) {

  peer = new Peer({ key: 'lwjd5qra8257b9', debug: 3});

   //  on connect
  var c = sharedService.peer2.connect(sharedService.peerId1);

  //    connect
  //      enable click listeners for controller buttons
  //        click listeners call connection.send()

  c.on('data', function(data) {
    // When we receive 'Hello', send ' world'.
    console.log(data);
    c.send(' peer');
  }); 

  $scope.clickButton = function(button){
    console.log(button);
  } 
  console.log("test3");
}

function main($scope, $http){
  console.log("main");
  var players = [];

  peer = new Peer({ key: 'lwjd5qra8257b9', debug: 3});

  peer.on('open', function(id){
    var peerId = id;      

    $http({
      url: "pooter.sandile.me:7373/generatorqr/" + id, 
      method: "GET",
    })
    .success(function(data, status) {
      console.log(status);
      console.log(data);

      peer.on('connection', function(connection) {
      
        if (players.length < 2){
          players.push(connection);
        }

        connection.on("data",function(data){
          console.log(data);
        });

      });

    })
    .error(function(data, status) {
      console.log(status);
      console.log(data);
    });

  });



}

console.log("test2");
