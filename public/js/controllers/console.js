angular.module('mean.system').controller('ConsoleController', ['$scope', 'Global',
    function($scope, Global) {
        $scope.global = Global;
        // Build peer object
        var peer = new Peer({
            host: window.location.hostname,
            port: 3333,
            debug: 1
        });
        var peerId = peer.id;
        // Make the the WebRTC function registrations
        var onConnection = function (connection) {
            connection.on("data", function(data) {
                console.log(data);
            });
        };
    }
]);