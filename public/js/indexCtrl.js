
var indexApp = angular.module('indexApp', []);

indexApp.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});

indexApp.controller('IndexCtrl', function($scope, $http) {
	/*var refresh = function() {
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
			});
		}
	};*/

	var habiticaAPI = 'https://em-game.eecs.berkeley.edu/api/v3';
	var userId = '';
    var userApiToken = '';
	var login = function(){
		var data = {'username': 'Test100', 'email': 'loudseed83@save.world', 'password': 'loudseed83'};
		$http.post(habiticaAPI + '/user/auth/local/login', data).then(function(res){
			console.log(res.data);
			userId = res.data.data.id;
			userApiToken = res.data.data.apiToken;
			allUsersForLeaderBoard();
		}, function(err) {
			console.log(err);
		});
	};
	login();

	var users = [];
    var partyList = [];
    $scope.loading = true;
    var allUsersForLeaderBoard = function(){
        $http.get(habiticaAPI + '/members/all').then(function(response){
            console.log("Sucessfully got all the users");
            var allUsers = response.data.data;
            var ignoreList = ['Superb Girl','Test-em-mri','Test_em-mr','Test_berkeley',
                        'Abcdef','admin','Ucb.sdb.android.3','Ucb.sdb.android.1','Test', 'Test100',
                        'Em Jr.#4', 'Em jr#3', 'Em_MR_2', ];
            users = allUsers.filter(function(obj) {
                return ignoreList.indexOf(obj.profile.name) === -1;
            });
            users = users.filter(function(obj){
                return obj.profile.name.slice(0,14).toLowerCase() !== 'e-mission-test';
            });
            users = roundExp(users);
            sortForLeaderboard(users);
            users = addRank(users);
            console.log("Sucessfully sorted all the users");
            getPartyForAllUsers(users);
            setRank(partyList);
        }, function(error){
            console.log("Error getting all the users");
            console.log(error);
        });
    };

    var getPartyForAllUsers = function(users) {
        partyList = [];
        for (var i = 0; i < users.length; i++) {
            var partyInList = false;
            if('_id' in users[i].party){
                if(partyList.length === 0){
                    var party = {'_id' : users[i].party._id, 'members': [users[i]], 'partyObj': {}, 'stats':{}};
                    getPartyById(users[i].party._id, 0);
                    partyList.push(party);
                } else {
                    for (var j = 0; j < partyList.length; j++) {
                        if(partyList[j]._id === users[i].party._id){
                            partyList[j].members.push(users[i]);
                            partyInList = true;
                        }
                    }
                    if(!partyInList) {
                        party = {'_id' : users[i].party._id, 'members': [users[i]], 'partyObj': {}, 'stats':{}};
                        getPartyById(users[i].party._id, j);
                        partyList.push(party);
                    }
                }
            }
        }
        $scope.loading = false;
    };

    var getPartyById = function(id, j) {
    	var headers = {'x-api-user': userId, 'x-api-key': userApiToken};
        $http.get(habiticaAPI + '/groups/'+id, {headers: headers}).then(function(response){
            console.log("Sucessfully got a user's party");
            partyList[j].partyObj = response.data;
        }, function(error){
            console.log("Error when getting a user's party");
        });
    };

    var setRank = function(partyList) {
        partyList.forEach(function(party){
            var totalLvl = 0;
            var totalExp = 0;
            var memberCount = 0; //Can't use member count of the partyObj because of invisible member count bug
            party.members.forEach(function(member) {
                totalLvl += member.stats.lvl;
                totalExp += member.stats.exp;
                memberCount++;
            });
            party.stats.lvl = totalLvl;
            party.stats.exp = totalExp;
            party.memberCount = memberCount;
        });
        partyList = partyList.filter(function(obj){
            return obj.memberCount > 1;
        });
        sortForLeaderboard(partyList);
        partyList = addRank(partyList);
        $scope.partys = partyList;
        console.log(partyList);
    };

    var roundExp = function(list){
        for (var i = 0; i < list.length; i++) {
           list[i].stats.exp = Math.round(list[i].stats.exp);
        }
        return list;
    };

    var sortForLeaderboard = function(list){
        list.sort(function(a, b){
            var c = b.stats.lvl - a.stats.lvl;
            if (c !== 0)
                return c;
            return b.stats.exp - a.stats.exp;
        });
    };

    var addRank = function(list){
        for (var i = 0; i < list.length; i++) {
           list[i].rank = i+1;
        }
        return list;
    };
});
