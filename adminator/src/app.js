angular.module('app', ['routing', 'mainController', 'authService', 'ProfileCtrl', 'profileService', 'ComposeCtrl', 'mailService'])

.config(($httpProvider)=>{
    $httpProvider.interceptors.push('AuthInterceptors') 
})