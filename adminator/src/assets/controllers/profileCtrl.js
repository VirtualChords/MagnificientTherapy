angular.module('ProfileCtrl', ['profileService', 'authService'])

    .controller('profileCtrl', function (Auth, $rootScope, $route, updateProfile) {
        vm = this;


        // $rootScope.$on('$routeChangeStart', () => {
        Auth.getUser()
            .catch((err) => {
                console.log(err)
            })
            .then((data) => {
                console.log(data)
                vm.username = data.data.username,
                    vm.picture = data.data.picture,
                    vm.name = data.data.name,
                    vm.address = data.data.address,
                    vm.email = data.data.email,
                    vm.phone = data.data.phone,
                    vm.id = data.data._id
            });
        // })


        this.editing = false;

        this.edit = () => {
            vm.editing = true;
        }

        this.cancel = () => {
            vm.editing = false;
            $route.reload()
        }

        this.makeEdit = function(profile){
            let updateData = {
                username : profile.username,
                picture : profile.picture,
                name : profile.name,
                address : profile.address,
                email : profile.email,
                phone : profile.phone,
                picture: profile.picture
            }
            console.log(profile)
            updateProfile.makeEdit(updateData)
            .then((data) => {
                vm.editing = false;
                $route.reload()
            }, (err) => {
                console.log(err)
            })

        };

        // this.makeEdit = (edit) => {

        // };
    })
    .directive('forProfile', function ($compile) {
        var exports = {};
        // exports.controller = 'profileCtrl';
        // exports.controllerAs = 'profile';

        exports.scope = {
            value: '=',
            editing: '=',
            updates: '='
        }

        function link(scope, element, attrs) {
            let newElement;


            if (attrs.type != 'text') {
                template = '<input type="attrs.for-type" class="form-control" ng-model="value" ng-show="editing"><div class="" ng-hide="editing">{{ value }}</div>'

            } else if (attrs.type == 'text' || !attrs.type) {
                template = '<input type="text" class="form-control" ng-model="value" ng-show="editing"><div class="" ng-hide="editing">{{ value }}</div>'
            }



            newElement = $compile(template)(scope);
            element.replaceWith(newElement)

            scope.$on('$destroy', function () {
                newElement = undefined;
                element = undefined;
            });
        }


        // exports.scope = {}


        exports.restrict = 'E';
        exports.link = link;

        return exports;
    })