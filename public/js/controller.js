
var indexApp = angular.module('indexApp', []);

indexApp.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});

indexApp.controller('VoteCtrl', function($scope, $http) {

	var refresh = function() {
		$http.get('/poll').success(function(res) {
			console.log("Getting")
			console.log(res);
			$scope.choices = res;
			$scope.inputChoiceName = "";
		})
	};
	refresh();

	$scope.addChoice = function() {
		console.log($scope.inputChoiceName);
		var total = 0;
		if($scope.choices.length != 0)
			total = $scope.choices[0].totalVotes
		$http.post('/poll', { text: $scope.inputChoiceName, totalVotes: total }).success(function(res) {
			console.log("Added the choice")
			console.log(res)
			refresh();
		})
	}
	
	$scope.delete = function(id) {
		$http.delete('/poll/' + id).success(function(res) {
			console.log("Deleted the choice");
			refresh();
		})
	}

	$scope.selected = function(id){
		$scope.theChoiceId = id;
	}

	$scope.vote = function(){
		if($scope.theChoiceId == null){
			alert('Select a reward to vote');
		} else {
			$http.put('/poll/' + $scope.theChoiceId).success(function(res) {
				console.log("Voted")
				refresh();
				$scope.theChoiceId = null;
			})
		}
	}
});
