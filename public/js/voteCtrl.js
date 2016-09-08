
var indexApp = angular.module('indexApp', []);

indexApp.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});

indexApp.controller('VoteCtrl', function($scope, $http) {
	$scope.test = "TEST!"
	var refresh = function() {
		$http.get('/poll').then(function(res) {
			$scope.polls = res.data;
			$scope.inputChoiceName = "";
		}, function(err) {
			console.log(err);
		})
	};
	refresh();

	$scope.selected = function(id){
		$scope.theChoiceId = id;
	}

	$scope.vote = function(){
		if($scope.theChoiceId == null){
			alert('Select a reward to vote');
		} else {
			$http.put('/poll/' + $scope.theChoiceId).then(function(res) {
				refresh();
				$scope.theChoiceId = null;
			}, function(err) {
				console.log(err);
			})
		}
	}
});
