angular.module('mailService', [])

    .factory('mailTo', ($http, $q) => {
        mailTo = {}

        mailTo.sendMail = (email) => {
            console.log(email)
            return $http.post('http://localhost:8080/email/send', email)
                .then(function (data) {
                    console.log(data)
                    return data
                })
                .catch(function (err) {
                    console.log(err)
                    return err
                })
        }


        return mailTo
    })