var posApp = angular.module('posApp', ['ui.bootstrap', 'ngResource'])
	.factory('Applications', function ($resource) {
		return $resource('/applications', {})
	})
	.factory('Locations', function ($resource) {
		return $resource('/locations', {})
	})
	.factory('Terminals', function ($resource) {
		return $resource('/terminals', {})
	})
;
//var posApp = angular.module('posApp', ['ui.bootstrap']);


posApp.config(function ($routeProvider) {
 	$routeProvider
 		.when('/', 	
 			{
 				templateUrl: 'app/partials/home.html', 
 				controller: 'CartController'
 			})
 	    .when('/list', 
 	    	{
 	    		templateUrl: 'app/partials/list.html', 
 	    		controller: 'CartController'
 	    	})

 		.when('/appevents', 
 			{
 				templateUrl: 'app/partials/appevents.html', 
 				controller: 'AppEventController'
 			})	
 		.when('/sysevents', 
 			{
 				templateUrl: 'app/partials/sysevents.html', 
 				controller: 'SysEventController'
 			})
 		.when('/processhistory', 
 			{
 				templateUrl: 'app/partials/processhistory.html', 
 				controller: 'ProcessHistoryController'
 			})
 		.when('/jmsjunk', 
 			{
 				templateUrl: 'app/partials/jmsjunk.html',
 				controller: 'JMSHistoryController'
 			})
 		.otherwise({redirectTo: '/'});
 });

//*************************************************************************************
//* this prevents the AngularJS from sending the x-requested-with header
//* and sends our hacky authentication headers
//* 
//*************************************************************************************
posApp.config(function($httpProvider) {
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
	//$httpProvider.defaults.headers.common['ppos-user'] = '102';
	//$httpProvider.defaults.headers.common['ppos-pswd'] = '102';
})