var app = angular.module('UpdateSetApp', []);
app.controller('UpdateSetController', ['$scope', '$http', function($scope, $http){
	$http.get('/updatesets/names')
		.then(function(data){
			var dataArr = [];
			var datum = data.data;
			for (var item in datum) {
				dataArr.push(
					{'name': datum[item].name, 
					 'description' : datum[item].description, 
					 'migration_plan' : datum[item].u_migration_plan,
					 'rally' : datum[item].u_rally,
					 'closed_by' : datum[item].completed_by,
					 'closed_on' : datum[item].completed_on, 
					 'opened_by' : datum[item].sys_created_by, 
					 'state' : datum[item].state,
					 'created_on' : datum[item].sys_created_on,
					 'changeNumber' : ''
					});
			}
			$scope.options = dataArr;
		});
	$scope.updateList = function(updateSets){
		$scope.resultsHolder = updateSets;
	}
	$scope.updateChangeNumber = function(){
		var results = $scope.resultsHolder;
		for (var result in results){
			results[result].changeNumber = $scope.change;
		}
		$scope.resultsHolder = results;
	}
	$scope.updateReleaseNumber = function(){
		var results = $scope.resultsHolder;
		for (var result in results){
			results[result].releaseNumber = $scope.release;
		}
		$scope.resultsHolder = results;
	}
	$scope.createMigration = function() {
		$scope.resultHolder.username = $scope.username;
		$scope.resultHolder.password = $scope.password;
		$http.post('/updatesets/migration', $scope.resultsHolder)
			.then(function(data){
				console.log(data);
			});
	}
}]).directive('resultsHolder', function(){
	return {
		templateUrl: 'resultsHolder.html'
	}
}).directive('commandBar', function(){
	return {
		templateUrl: 'commandBar.html'
	}
});