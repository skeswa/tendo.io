//Setting up route
window.app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'views/console.html',
            controller: "ConsoleController"
        }).
        when('/login', {
            templateUrl: 'views/login.html',
            controller: "loginController"
        }).
        when('/setup', {
            templateUrl: 'views/setup.html',
            controller: "setupController"
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

//Setting HTML5 Location Mode
window.app.config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix("!");
    }
]);