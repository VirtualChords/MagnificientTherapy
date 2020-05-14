const app = angular.module('routing', ['ngRoute'])

.config(($routeProvider, $locationProvider)=>{
    $routeProvider
    .when('/', {
        templateUrl: './dashboard.html',
        title: 'Dashboard',
        authenticated: true
    })

    .when('/profile', {
        templateUrl: './profile.html',
        title: 'My Profile',
        controller: 'profileCtrl',
        controllerAs: 'profile',
        authenticated: true
    })

    .when('/gallery', {
        templateUrl: '../views/pages/gallery.html',
        title: 'Gallery',
        authenticated: true
    })

    .when('/admins', {
        templateUrl: '../views/pages/admins.html',
        title: 'Admin Users',
        authenticated: true
    })

    .when('/messages', {
        templateUrl: './email.html',
        title: 'Messages',
        authenticated: true
    })

    .when('/compose', {
        templateUrl: './compose.html',
        controller: 'composeCtrl',
        controllerAs: 'compose',
        title: 'Compose',
        authenticated: true
    })

    .when('/team', {
        templateUrl: '../views/pages/team.html',
        title: 'Our Team',
        authenticated: true
    })

    .when('/u&e', {
        templateUrl: './calendar.html',
        title: 'Updates & Events',
        authenticated: true
    })

    .when('/registrations', {
        templateUrl: '../views/pages/registrations.html',
        authenticated: false
    })

    .when('/signin', {
        templateUrl: './signin.html',
        title: 'Sign In',
        authenticated: false
    })

    .when('/register', {
        templateUrl: './signup.html',
        title: 'Register',
        authenticated: true
    })

    .otherwise({redirectTo: '/'} );

    $locationProvider.html5Mode({
        enabled: true,
        requiredBase: false
    })
});



app.run(['$rootScope', 'Auth', '$location', function($rootScope, Auth, $location) {
    $rootScope.$on('$routeChangeStart', (event, next, current)=>{
        // console.log(next.$$route.authenticated)
        console.log(Auth.isLoggedIn())
        if(next.$$route.authenticated == true){
            if(!Auth.isLoggedIn()){
                event.preventDefault()
                // main.loggerIn = 'You are not logged in, pls signin again'
                $location.path('/signin');
            }
        } else if (next.$$route.authenticated == false){
            if(Auth.isLoggedIn()){
                event.preventDefault()
                $location.path('/');
            }
        };
    });
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);