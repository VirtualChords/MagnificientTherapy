angular.module('profileService', ['authService'])

.factory('updateProfile', ($http, $q, authToken) => {
    profileupdate = {};

    vm = this;

    profileupdate.makeEdit = (updateData) => {
        console.log(updateData)
        return $http.put('http://localhost:8080/admin/profile', updateData)
        .then((data) => {
            authToken.setToken(data.data.token)
            return data
        }, (err) => {
            return $q.reject({message: 'An error occured'})
        });
    }

    return profileupdate
})