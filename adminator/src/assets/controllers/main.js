angular.module('mainController', ['authService'])

    .controller('mainCtrl', function (Auth, $rootScope, $location, $timeout) {
        var vm = this;

        $rootScope.$on('$routeChangeStart', () => {
            // console.log($location.path())
            // for signin page
            vm.signedin = function () {
                if ($location.path() == '/signin') {
                    // console.log(true)
                    return true;
                } else {
                    return false
                };
            }

            if (Auth.isLoggedIn()) {
                console.log('User is logged in');
                Auth.getUser().then((data) => {
                    // if(err){
                    //     console.log(err)
                    // } else {
                    vm.username = data.data.username,
                    vm.picture = data.data.picture,
                    vm.isLoggedIn = true;

                    // }
                })
                    .catch((err) => {
                        vm.isLoggedIn = false
                        console.log(err)
                    })
            } else {
                console.log('user not logged in')
                vm.isLoggedIn = false;
            }
        });


        this.doLogin = function (loginData) {
            this.errorMsg = false;
            this.successMsg = false;

            Auth.login(vm.loginData).then(function (data) {
                if (data.data.success) {
                    vm.successMsg = data.data.message;
                    $timeout(() => {
                        $location.path('/')
                        vm.successMsg = false;
                        vm.loginData = {};
                    }, 3000)
                } else {
                    vm.errorMsg = data.data.message;
                }
            });
        };

        this.doLogout = () => {
            Auth.logout()
            vm.logout = 'LOGGING OUT ...'
            $timeout(() => {
                $location.path('/signin')
            }, 3000);
        };
    });