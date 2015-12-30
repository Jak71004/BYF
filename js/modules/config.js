(function ( ) {
    angular.module('BetYouFail')
        .config(function ($routeProvider) {
        $routeProvider.
            when('/home', {
                templateUrl: 'home.html',
                controller: 'mainCtrl'
            }).
            when('/wager', {
                templateUrl: 'wager.html',
                controller: 'wagerCtrl'
            }).            
            when('/defeat', {
                templateUrl: 'defeat.html',
                controller: 'defeatCtrl'
            }).
            when('/faq', {
                templateUrl: 'faq.html',
                controller: 'faqCtrl'
            }).
            when('/contactus', {
                templateUrl: 'contactus.html',
                controller: 'contactCtrl'
            }).
            otherwise({redirectTo:'/home'});
        });
}());
