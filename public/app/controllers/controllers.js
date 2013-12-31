//************************************************************************************************
//
//  Controllers logic goes in here!!!
//
//************************************************************************************************
// controller for handling the shopping carts
//************************************************************************************************
posApp.controller('CartController', function ($scope, $http, $modal, $log) {

	// controller initialization
	init();

	function init() {
		$scope.carts = [];  // test empty/no carts
	};

	$scope.getCarts = function () {
		$scope.url = 'http://localhost:7001/restservices/v1/carts';
		if ($scope.searchCartName && $scope.searchStatus) {
			$scope.url +='?cartName='+$scope.searchCartName+'&status='+$scope.searchStatus;
		} else if ($scope.searchCartName) {
			$scope.url += '?cartName='+$scope.searchCartName;
		} else if ($scope.searchStatus) {
			$scope.url +='?status='+$scope.searchStatus;
		}
		console.log('url: '+$scope.url);
		//$http({method: 'GET', url: $scope.url } )
		$http({method: 'GET', url: $scope.url, headers: {'ppos-user': '102', 'ppos-pswd': '102'} } )
			.success(function(data, status) {
		        $scope.status = status;
		        $scope.carts = data;
		        console.log('getCarts status='+status);
		      })
			 .error(function(data, status) {
		        $scope.carts = [];
		        $scope.status = status;
		        console.log('getCarts status='+status);
		        //TODO need to show some type of error message here!!!
		    });
		};

	$scope.deleteCart = function (idx) {
		console.log('using idx='+idx);
		var cartToDelete = $scope.carts[idx];
		// process the ajax delete
		$http.delete('http://localhost:7001/restservices/v1/carts/' + cartToDelete.cartId)
  			.success(function(response, status, headers, config){
  				// if successful - remove from the array
    			$scope.carts.splice(idx, 1);
			})
			.error(function(response, status, headers, config){
			    $scope.error_message = response.error_message;
			    console.log("error msg"+$scope.error_message);
			});
		
	};

	// modal stuff copied into here
  	$scope.open = function (idx) {
  		console.log("open idx:"+idx);
	    var modalInstance = $modal.open({
	      templateUrl: 'app/partials/cartDetails.html',
	      controller: ModalInstanceCtrl,
	      resolve: {
	        cart: function () {
	        	$log.info('resolve cart: ' + $scope.carts[idx].cartId);
	        	return $scope.carts[idx];
	        }
	      }
	    });

	    modalInstance.result.then(function (cart) {
	      console.log('result.then ->cart:'+cart);
	      $scope.cart = cart;
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	};

});
//************************************************************************************************
// controller for handling the Application Events
//************************************************************************************************
posApp.controller('AppEventController', function ($scope, $http, Applications, Locations, Terminals) {

// TODO check out the resource class for more compact angular code

	// controller initialization
	init();

	Applications.query(function (response) {
		$scope.apps = response;
		createApplicationMap();
	});

	Locations.query(function (response) {
		$scope.locs = response;
	});

	Terminals.query(function (response) {
		$scope.terms = response;
	});

	function init() {
		$scope.loading = false;
		$scope.limits = [10, 20, 50, 100];
		$scope.limit = $scope.limits[0];
		$scope.appevents = [];
		$scope.apps = [];
		$scope.locs = [];
		$scope.terms = [];
		$scope.application = $scope.apps[0];
		$scope.location = $scope.locs[0];
		$scope.terminal = $scope.terms[0];
		$scope.eventtype = null;
		$scope.associate = null;

		$scope.eventtypes = [
		 { id: '1', type:'Server Started'},
		 { id: '2', type:'Login Successful'},
		 { id: '3', type:'Download Failed'},
		 { id: '4', type:'Login Attempt Failed'},
		 { id: '5', type:'Txn Sequence number failed'},
		 { id: '6', type:'Emergency Cash Drawer Open Success'},
		 { id: '7', type:'Emergency Cash Drawer Open Failed'},
		 { id: '8', type:'Store transaction not found in Central'}
		];

		createEventTypeMap();
	};

	function createApplicationMap() {
		$scope.applicationMap = {};
		for (var i = 0; i < $scope.apps.length; i++) {
			$scope.applicationMap[$scope.apps[i].APPLICATION_ID] = $scope.apps[i].NAME;
		}
	};

	$scope.getApplicationName = function(id) {
		return $scope.applicationMap[id];
	};

	function createEventTypeMap() {
		$scope.eventTypeMap = {};
		for (var i = 0; i < $scope.eventtypes.length; i++) {
			$scope.eventTypeMap[$scope.eventtypes[i].id] = $scope.eventtypes[i].type;
		}
	};

	$scope.getEventType = function(id) {
		return $scope.eventTypeMap[id];
	};

	// TODO pagination - see what AngularJS has!
	$scope.search = function () {
		$scope.url = '/appevents?limit='+$scope.limit;
		if ($scope.application) {
			$scope.url += '&application='+$scope.application;
		}
		if ($scope.location) {
			$scope.url += '&location='+$scope.location;
		}
		if ($scope.terminal) {
			$scope.url += '&terminal='+$scope.terminal;
		}
		if ($scope.eventtype) {
			$scope.url += '&eventtype='+$scope.eventtype;
		}
		if ($scope.associate) {
			$scope.url += '&associate='+$scope.associate;
		}
		console.log("url: "+$scope.url);
		$scope.loading = true;
		$http({method: 'GET', url: $scope.url } )
			.success(function(data, status) {
				$scope.loading = false;
		        $scope.status = status;
		        $scope.appevents = data;
		        console.log('search status='+status+' found '+$scope.appevents.length+' appevents');
		        if ($scope.appevents.length == 0)
		        	alert("No entries found!");
		      })
			.error(function(data, status) {
		        $scope.appevents = [];
		        $scope.status = status;
		        console.log('search status='+status);
		        //TODO need to show some type of error message here!!!
		    });
		};
});

//****************************************************************************************************
// controller for handling the System Events
//****************************************************************************************************
posApp.controller('SysEventController', function ($scope, $http, Locations, Terminals) {

	// controller initialization
	init();

	Locations.query(function (response) {
		$scope.locs = response;
	});

	Terminals.query(function (response) {
		$scope.terms = response;
	});

	function init() {
		$scope.eventtypes = [
		 { id: '1', type:'Starting base install'},
		 { id: '2', type:'Finished base install'},
		 { id: '3', type:'Starting db upgrade'},
		 { id: '4', type:'Finished db upgrade'},
		 { id: '11', type:'Starting custom install'},
		 { id: '12', type:'Finished custom install'},
		 { id: '13', type:'Starting custom upgrade'},
		 { id: '14', type:'Finished custom upgrade'}
		];

		$scope.loading = false;
		$scope.limits = [10, 20, 50, 100];
		$scope.limit = $scope.limits[0];
		$scope.sysevents = [];
		$scope.locs = [];
		$scope.location = $scope.locs[0];
		$scope.terms = [];
		$scope.terminal = $scope.terms[0];
		$scope.eventtype = 
		$scope.associate = null;

		createEventTypeMap();

	};

	function createEventTypeMap() {
		$scope.eventTypeMap = {};
		for (var i = 0; i < $scope.eventtypes.length; i++) {
			$scope.eventTypeMap[$scope.eventtypes[i].id] = $scope.eventtypes[i].type;
		}
	};

	$scope.search = function () {
		$scope.url = '/sysevents?limit='+$scope.limit;
		if ($scope.location) {
			$scope.url += '&location='+$scope.location;
		}
		if ($scope.terminal) {
			$scope.url += '&terminal='+$scope.terminal;
		}
		if ($scope.eventtype) {
			$scope.url += '&eventtype='+$scope.eventtype;
		}
		console.log("url: "+$scope.url);
		$scope.loading = true;
		$http({method: 'GET', url: $scope.url } )
			.success(function(data, status) {
				$scope.loading = false;
		        $scope.status = status;
		        $scope.sysevents = data;
		        console.log('search status='+status+' found '+$scope.sysevents.length+' sysevents');
		        if ($scope.sysevents.length == 0)
		        	alert("No entries found!");
		      })
			.error(function(data, status) {
		        $scope.sysevents = [];
		        $scope.status = status;
		        console.log('search status='+status);
		        //TODO need to show some type of error message here!!!
		    });
		};

});

//****************************************************************************************************
// controller for handling the Process History data
//****************************************************************************************************
posApp.controller('ProcessHistoryController', function ($scope, $http) {

	// controller initialization
	init();

	function init() {

		$scope.loading = false;
		$scope.limits = [10, 20, 50, 100];
		$scope.limit = $scope.limits[0];
		$scope.businessDate = '';  // maybe default to yesterday!
		$scope.histevents = [];
		$scope.locs = [];
		$scope.businessdate = '';
		getProcesses();
		getLocations();  // try to get re-use from parent scope?

	};

	function getProcesses() {
		$scope.url = '/processes';
		console.log("url: "+$scope.url);
		$http({method: 'GET', url: $scope.url } )
			.success(function(data, status) {
		        $scope.status = status;
		        $scope.processes = data;
		        console.log('getProcesses status='+status+ ' found '+ $scope.processes.length+' processess');
		        createProcessMap();
		    })
			.error(function(data, status) {
		        $scope.processes = [];
		        $scope.status = status;
		        console.log('getProcesses status='+status);
	    });
	};

	function getLocations() {
		$scope.url = '/locations';
		console.log("url: "+$scope.url);
		$http({method: 'GET', url: $scope.url } )
			.success(function(data, status) {
		        $scope.status = status;
		        $scope.locs = data;
		        console.log('getLocations status='+status+ ' found '+ $scope.locs.length+' Locations');
		    })
			.error(function(data, status) {
		        $scope.locs = [];
		        $scope.status = status;
		        console.log('getTerminals status='+status);
	    });
	};

	function getTerminals() {
		$scope.url = '/terminals';
		console.log("url: "+$scope.url);
		$http({method: 'GET', url: $scope.url } )
			.success(function(data, status) {
		        $scope.status = status;
		        $scope.terms = data;
		        console.log('getTerminals status='+status+' found '+ $scope.apps.length+' Terminals');
		    })
			.error(function(data, status) {
		        $scope.terms = [];
		        $scope.status = status;
		        console.log('getTerminals status='+status);
	    });
	};

	function createProcessMap() {
		$scope.processMap = {};
		for (var i = 0; i < $scope.processes.length; i++) {
			$scope.processMap[$scope.processes[i].PROCESS_ID] = $scope.processes[i].NAME;
		}
	};

	$scope.getProcessName = function(id) {
		return $scope.processMap[id];
	};

	$scope.search = function () {
		// TODO  - fix this - currently only passing a business date & limit as query parms
		$scope.url = '/prochist?limit='+$scope.limit;
		if ($scope.businessdate) {
			var bus_date = $scope.businessdate.getDate();
    		var bus_month = $scope.businessdate.getMonth() + 1; //Months are zero based
    		var bus_year = $scope.businessdate.getFullYear();
			$scope.url += '&businessdate='+bus_year+'-'+bus_month+'-'+bus_date;
		}
		// if ($scope.location) {
		// 	$scope.url += '&location='+$scope.location;
		// }
		// if ($scope.processtype) {
		// 	$scope.url += '&processtype='+$scope.processtype;
		// }
		//console.log("businessdate="+$scope.businessdate + " typeof: "+(typeof $scope.businessdate));
		console.log("url: "+$scope.url);
		$scope.loading = true;
		$http({method: 'GET', url: $scope.url } )
			.success(function(data, status) {
				$scope.loading = false;
		        $scope.status = status;
		        $scope.histevents = data;
		        console.log('search status='+status+' found '+$scope.histevents.length+' process history events');
		        if ($scope.histevents.length == 0)
		        	alert("No entries found!");
		      })
			.error(function(data, status) {
		        $scope.histevents = [];
		        $scope.status = status;
		        console.log('search status='+status);
		        //TODO need to show some type of error message here!!!
		    });
		};

});

//****************************************************************************************************
//// controller for extracting the JMS data that might be helpful
//****************************************************************************************************
posApp.controller('JMSController', function ($scope, $http) {
	
	// need list of queues and then counts/data we are interested in

	// then we can generate the view 

	// read the jbm_postoffice to get list of queues

});

//****************************************************************************************************
//  AngularJS Modal controller
//****************************************************************************************************
var ModalInstanceCtrl = function ($scope, $modalInstance, cart) {
  console.log('ModalInstanceCtrl->$scope:'+$scope);
  console.log('ModalInstanceCtrl->$modalInstance:'+$modalInstance);
  console.log('ModalInstanceCtrl->cart:'+cart);
  console.log('ModalInstanceCtrl->cartId:'+cart.cartId+' cartName:'+cart.cartName);
  $scope.cart = cart;

  $scope.ok = function () {
    $modalInstance.close($scope.cart);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

//*******************************************************************
//  Datepicker controller
//*******************************************************************
var DatepickerController = function ($scope, $timeout) {
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.showWeeks = false;
  $scope.toggleWeeks = function () {
    $scope.showWeeks = ! $scope.showWeeks;
  };

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = ( $scope.minDate ) ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function() {
    $timeout(function() {
      $scope.opened = true;
    });
  };

  $scope.dateOptions = {
    'year-format': "'yyyy'",
    'starting-day': 1
  };
};