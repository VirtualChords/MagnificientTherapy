angular.module('routing', ['ngRoute'])

.config(($routeProvider, $locationProvider)=>{
    $routeProvider
    .when('/', {
        templateUrl: '../views/pages/dashboard.html'
    })

    .when('/profile', {
        templateUrl: '../views/pages/profile.html'
    })

    .when('/gallery', {
        templateUrl: '../views/pages/gallery.html'
    })

    .when('/admins', {
        templateUrl: '../views/pages/admins.html'
    })

    .when('/messages', {
        templateUrl: '../views/pages/messages.html'
    })

    .when('/team', {
        templateUrl: '../views/pages/team.html'
    })

    .when('/u&e', {
        templateUrl: '../views/pages/u&e.html'
    })

    .when('/registrations', {
        templateUrl: '../views/pages/registrations.html'
    })

    .otherwise({redirectTo: '/'} );

    $locationProvider.html5Mode({
        enabled: true,
        requiredBase: false
    })
});