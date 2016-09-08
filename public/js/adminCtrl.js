
var adminApp = angular.module('adminApp', []);

adminApp.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});

adminApp.controller('AdminCtrl', function($scope, $http) {

	$scope.admin = {}
	$scope.loggedIn = false;

	$scope.logIn = function() {
		if($scope.admin.username == null || $scope.admin.password == null){
			alert("Username and Password are required");
		} else {
			$http.post('/login', {username: $scope.admin.username, password: $scope.admin.password}).then(function(res) {
				if(res.data.success == true){
					$scope.loggedIn = res.data.success;
					$scope.admin = {};
					refresh();
				} else {
					alert(res.data.message)
					$scope.admin = {}
				}
			}, function(err) {
				console.log(err);
			});
		}
	}

	var refresh = function() {
		$http.get('/poll').then(function(res) {
			$scope.choices = res.data;
			$scope.inputChoiceName = "";
		}, function(err) {
			console.log(err);
		})
	};

	$scope.addChoice = function() {
		var total = 0;
		if($scope.choices.length > -1)
			total = $scope.choices[0].totalVotes
		$http.post('/poll', { text: $scope.inputChoiceName, totalVotes: total }).then(function(res) {
			refresh();
		}, function(err){
			console.log(err);
		})
	}
	
	$scope.delete = function(id) {
		$http.delete('/poll/' + id).then(function(res) {
			refresh();
		}, function(err) {
			console.log(err);
		})
	}
});
