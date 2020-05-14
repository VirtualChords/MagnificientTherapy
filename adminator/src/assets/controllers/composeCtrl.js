angular.module('ComposeCtrl', ['mailService'])

.controller('composeCtrl', function (mailTo) {
    vm = this;

    this.sendMail = function (mail) {
        email = {
            to: vm.mail.to,
            copy: vm.mail.copy,
            subject: vm.mail.subject,
            message: vm.mail.message
        };
        
        mailTo.sendMail(email).then(function(data){
            console.log(data)
        }).catch(function(err){
            console.log(err)
        })
    }
    
})