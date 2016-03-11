(function ( ) {
    angular.module('BetYouFail')
        .config(function ($routeProvider) {
        $routeProvider.
            when('/home', {
                templateUrl: 'home.html',
                //controller: 'mainCtrl'
            }).
            when('/wager', {
                templateUrl: 'wager.html',
                //controller: 'mainCtrl'
            }).            
            when('/defeat', {
                templateUrl: 'defeat.html',
                //controller: 'defeatCtrl'
            }).
            when('/faq', {
                templateUrl: 'faq.html',
                //controller: 'faqCtrl'
            }).
            when('/contactus', {
                templateUrl: 'contactus.html',
                //controller: 'contactCtrl'
            }).
            when('/failure', {
                templateUrl: 'failure.html',
                //controller: 'mainCtrl'
            }).
            when('/success', {
                templateUrl: 'success.html',
                //controller: 'mainCtrl'
            }).
            otherwise({redirectTo:'/home'});
        });
}());
