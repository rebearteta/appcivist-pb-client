﻿// This controller retrieves data from the Assemblies and associates it
// with the $scope
// The $scope is bound to the order view
appCivistApp.controller('AssemblyListCtrl', function($scope, $routeParams,
													 $resource, $location, Assemblies, loginService, localStorageService) {

	$scope.assemblies = [];
	$scope.serverBaseUrl = localStorageService.get("serverBaseUrl");

	init();

	function init() {
		$scope.assemblies = Assemblies.query();
		$scope.assemblies.$promise.then(function(data) {
			$scope.assemblies = data;
			localStorageService.set("assemblies", $scope.assemblies);
			//console.log("Assemblies arrived: " + JSON.stringify($scope.assemblies));
		});
	}
});

// This controller retrieves data from the Assemblies and associates it
// with the $scope
// The $scope is bound to the order view
appCivistApp.controller('AssemblyCtrl',	function($scope, $routeParams, $resource, $http, Assemblies,
													loginService, localStorageService) {
	$scope.currentAssembly = {};
	$scope.newAssembly = {};
	$scope.comments = 10;
	$scope.questions = 2;
	$scope.issues = 4;
	$scope.ideas = 3;

	console.log("Loading Assembly: "+$routeParams.aid);

	// I like to have an init() for controllers that need to
	// perform some initialization. Keeps things in
	// one place...not required though especially in the simple
	// example below
	init();

	function init() {

		// Grab assemblyID off of the route
		var assemblyID = ($routeParams.aid) ? parseInt($routeParams.aid)
			: 0;
		if (assemblyID > 0) {
			var currentAssembly = Assemblies.get({assemblyId: assemblyID}, function() {
				$scope.currentAssembly = currentAssembly;
				localStorageService.set("currentAssembly", $scope.currentAssembly);
				console.log("Obtained assembly: " + JSON.stringify($scope.currentAssembly));
			});
		}

		$http.get('assets/comments/comments.json').success(function(data){
			$scope.comments = data;
		}).error(function(error){
			console.log('Error loading data' + error);
		});
	}


	$scope.createNewAssembly = function(step) {
		if (step === 1) {
			console.log("Creating assembly with name = "+$scope.newAssembly.name);
			console.log("Creating assembly with description = "+$scope.newAssembly.description);

			if($scope.newAssembly.profile.membership.open) {
				$scope.newAssembly.profile.supportedMembership="OPEN";
			} else if ($scope.newAssembly.profile.membership.registration) {
				if($scope.newAssembly.profile.membership.invitation &&
					! $scope.newAssembly.profile.membership.request) {
					$scope.newAssembly.profile.supportedMembership = "INVITATION";
				} else if(! $scope.newAssembly.profile.membership.invitation &&
					 $scope.newAssembly.profile.membership.request) {
					$scope.newAssembly.profile.supportedMembership = "REQUEST";
				} else if($scope.newAssembly.profile.membership.invitation &&
					 $scope.newAssembly.profile.membership.request) {
					$scope.newAssembly.profile.supportedMembership = "INVITATION_AND_REQUEST";
				}
			}

			console.log("Creating assembly with membership = "+$scope.newAssembly.profile.supportedMembership);

			if($scope.newAssembly.profile.roles.no) {
				$scope.newAssembly.profile.managementType="OPEN";
			} else if ($scope.newAssembly.profile.roles.yes) {
				if($scope.newAssembly.profile.roles.coordinators &&
					! $scope.newAssembly.profile.roles.moderators ) {
					$scope.newAssembly.profile.managementType = "COORDINATED";
				} else if(! $scope.newAssembly.profile.roles.coordinators &&
					 $scope.newAssembly.profile.roles.moderators ) {
					$scope.newAssembly.profile.managementType = "MODERATED";
				} else if($scope.newAssembly.profile.roles.coordinators &&
					 $scope.newAssembly.profile.roles.moderators ) {
					$scope.newAssembly.profile.managementType = "COORDINATED_AND_MODERATED";
				}
			}

			console.log("Creating assembly with managementType = "+$scope.newAssembly.profile.managementType);
			localStorageService.set("temporaryNewAssembly",$scope.newAssembly)
		} else if (step === 2) {
			$scope.newAssembly = localStorageService.get("temporaryNewAssembly");
			console.log("Creating new Assembly: " + JSON.stringify($scope.newAssembly));
			var newAssembly = Assemblies.save($scope.newAssembly, function() {
				console.log("Created assembly: "+newAssembly);
				localStorageService.set("currentAssembly",newAssembly);
				$location.url('/assembly/'+newAssembly.assemblyId+"/forum");
			});
		}
	}

});