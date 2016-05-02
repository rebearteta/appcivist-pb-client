/**
 * Voting Landing Page
 */
 // The ballot UUID to use: 68643fbf-9a30-4b81-83d1-439947711a46
appCivistApp.controller('ballotStartCtrl', function($scope, $routeParams, $location, Ballot, localStorageService){


	$scope.user = localStorageService.get("user");

	var ballot = Ballot.get({uuid:$routeParams.uuid}).$promise;
  ballot.then(function(data) {
    //console.log(data)
    $scope.ballot = data;
  }, function(error){ window.appcivist.handleError(error); });

	$scope.transitionToRegistration = function(){
		if(localStorageService.get("authenticated")){
			$location.url("/ballot/" + $routeParams.uuid + "/vote");
		} else {
			$location.url("/ballot/" + $routeParams.uuid + "/register");
		}
	}
});
