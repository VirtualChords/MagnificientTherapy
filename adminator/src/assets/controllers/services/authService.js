angular.module('authService', [])

    .factory('Auth', ($http, authToken, $q, $timeout, $location) => {
        authFactory = {};

        var vm = this;

        authFactory.login = (loginData) => {
            // console.log(loginData)
            return $http.post('http://localhost:8080/auth/login', loginData)
                .then(function (data) {
                    // console.log(data)
                    authToken.setToken(data.data.token)
                    return data
                })
                .catch(function (error) {
                    // console.log(error.data);
                    return error

                })
        };

        /* check if user is logged in by calling for user details
            and confirming token authenticity */
        authFactory.isLoggedIn = () => {
            authFactory.getUser()
            // $timeout
            if (authToken.getToken()) {
                return true;
            } else {
                return false;
            }
        };

        /* Getting the token from local storage and converting its 
            availability to Boolean for use in authFactory.getUser() */
        authFactory.isLoggedOn = () => {
            if (authToken.getToken()) {
                return true;
            } else {
                return false;
            }
        };

        /* Getting user details after confirming an available token
            and confirming its validity */
        authFactory.getUser = () => {
            if (authFactory.isLoggedOn()) {
                return $http.post('http://localhost:8080/auth/me')
                .then((data) => {
                    // console.log(data.data);
                    return data;
                //     // }, (err)=>{
                //     //     console.log(err)
                //     //     return err;
                })
                .catch((err) => {
                    console.log(err)
                    authToken.setToken('');
                    $location.path('/signin');
                    return err
                })
            } else {
                return $q.reject({ message: 'You are not logged in' })
            }
        }

        authFactory.logout = () => {
            authToken.setToken('')
        };

        return authFactory;
    })

    .factory('authToken', ($window) => {
        AuthToken = {}

        AuthToken.setToken = (token) => {
            if (token) {
                $window.localStorage.setItem('MagniToken', token)
            } else {
                return $window.localStorage.removeItem('MagniToken')
            }
        }

        AuthToken.getToken = () => {
            return $window.localStorage.getItem('MagniToken')
        }

        return AuthToken;
    })

    .factory('AuthInterceptors', (authToken) => {
        authInterceptors = {};

        authInterceptors.request = (config) => {
            let token = authToken.getToken()

            if (token) config.headers['x-access-token'] = token

            return config;
        }

        return authInterceptors
    })