var scoreboardApp = angular.module('scoreboardApp', []);

scoreboardApp.controller('ScoreboardCtrl', function ($scope) {
	$scope.scoreboard = {
		visible: true,
		count: true,
		outs: true
	};
	$scope.scoreboard_rhe = {
		visible: true
	};
	$scope.home = {
		team: '',
		runs: 0,
		hits: 0,
		errors: 0,
		players: []
	};
	$scope.away = {
		team: '',
		runs: 0,
		hits: 0,
		errors: 0,
		players: []
	};
	for(var i=0; i<9; i++) {
		$scope.home.players.push({ number: '', name: '', position: ''});
	}
	for(var i=0; i<9; i++) {
		$scope.away.players.push({ number: '', name: '', position: ''});
	}
	$scope.runners = {
		first: false,
		second: false,
		third: false
	};
	$scope.title = '';
	$scope.batting = $scope.away;
	$scope.balls = 0;
	$scope.strikes = 0;
	$scope.outs = 0;
	$scope.inning = 1;
	$scope.inning_section = 'top';
	$scope.finished = false;
	
	$scope.clearRunners = function() {
		$scope.runners.first = false;
		$scope.runners.second = false;
		$scope.runners.third = false;
	};
	
	$scope.clearCount = function() {
		$scope.balls = 0;
		$scope.strikes = 0;
	};
	
	$scope.addBall = function() {
		$scope.balls++;
		if($scope.balls >= 4) {
			$scope.balls = 0;
			$scope.strikes = 0;
			
			// advance runners
			if($scope.runners.first) {
				if($scope.runners.second) {
					if($scope.runners.third) {
						$scope.batting.runs++;
					}
					$scope.runners.third = true;
				}
				$scope.runners.second = true;
			}
			$scope.runners.first = true;
		}
	};
	
	$scope.addStrike = function() {
		$scope.strikes++;
		if($scope.strikes >= 3) {
			$scope.balls = 0;
			$scope.strikes = 0;
			$scope.addOut();
		}
	};
	
	$scope.addOut = function() {
		$scope.outs++;
		if($scope.outs >= 3) {
			// todo advance inning
			$scope.balls = 0;
			$scope.strikes = 0;
			$scope.outs = 0;
			$scope.clearRunners();
			$scope.advanceInning();
		}
		$scope.clearCount();
	};
	
	$scope.advanceInning = function() {
		if($scope.inning_section == 'top') {
			$scope.inning_section = 'middle';
		} else if($scope.inning_section == 'middle') {
			$scope.inning_section = 'bottom';
			$scope.batting = $scope.home;
		} else if($scope.inning_section == 'bottom') {
			$scope.inning_section = 'end';
		} else {
			$scope.inning_section = 'top';
			$scope.batting = $scope.away;
			$scope.inning++;
		}
		$scope.clearRunners();
		$scope.balls = 0;
		$scope.strikes = 0;
		$scope.outs = 0;
	};
	
	$scope.updateInningSection = function() {
		if($scope.inning_section == 'top' || $scope.inning_section == 'end') {
			$scope.batting = $scope.away;
		} else {
			$scope.batting = $scope.home;
		}
	}
	
	$scope.homeRun = function() {
		$scope.batting.runs++;
		$scope.batting.hits++;
		if($scope.runners.first) {
			$scope.batting.runs++;
		}
		if($scope.runners.second) {
			$scope.batting.runs++;
		}
		if($scope.runners.third) {
			$scope.batting.runs++;
		}
		$scope.clearRunners();
		$scope.clearCount();
	};
	
	$scope.finishGame = function() {
		$scope.finished = true;
		$scope.inning_section = 'end';
		$scope.inning = '';
		$scope.clearRunners();
	};
	
	$scope.liveKeyboard = function(e) {
		var c = e.which;
		switch(c) {
			case 114: // r
			case 82: // R
				$scope.batting.runs++;
				break;
			case 104: // h
			case 72: // H
				$scope.batting.hits++;
				$scope.clearCount();
				break;
			case 101: // e
			case 69: // E
				if($scope.batting == $scope.home) {
					$scope.away.errors++;
				} else {
					$scope.home.errors++;
				}
				break;
			case 111: // o
			case 79: // O
				$scope.addOut();
				break;
			case 98: // b
			case 66: // B
				$scope.addBall();
				break;
			case 115: // s
			case 83: // S
				$scope.addStrike();
				break;
			case 99: // c
			case 67: // C
				$scope.clearCount();
				break;
			case 97: // a
			case 65: // A
				$scope.advanceInning();
				break;
			case 49: // 1
				$scope.runners.first = !$scope.runners.first;
				break;
			case 50: // 2
				$scope.runners.second = !$scope.runners.second;
				break;
			case 51: // 3
				$scope.runners.third = !$scope.runners.third;
				break;
		}
		setTimeout(function() {
			$('#liveKeyboard').val('');
		},1);
	};
	
	$scope.addPlayer = function(team) {
		team.players.push({
			name: '',
			number: '',
			position: ''
		});
	};
	
	$scope.removePlayer = function(player) {
		var p = -1;
		for(var i=0; i<$scope.home.players.length; i++) {
			if($scope.home.players[i] == player) {
				p = i;
			}
		}
		if(p > -1) {
			$scope.home.players.splice(p, 1);
			return;
		}
		for(var i=0; i<$scope.away.players.length; i++) {
			if($scope.away.players[i] == player) {
				p = i;
			}
		}
		if(p > -1) {
			$scope.away.players.splice(p, 1);
		}
	};
});

var showingSubtitle = false;
function toggleSubtitle(show) {
	if(show || !showingSubtitle) {
		$('.scoreboard_title').animate({ top: '100px' });
		showingSubtitle = true;
	} else {
		$('.scoreboard_title').animate({ top: '70px' });
		showingSubtitle = false;
	}
}
function toggleTitle() {
	if($('#game_title_input').val() == '') {
		toggleSubtitle(false);
	} else {
		toggleSubtitle(true);
	}
}

$(function() {
	setTimeout(function() {
		$('#live_title').fadeOut();
	}, 2500);
	$( ".sortable" ).sortable();
    $( ".sortable" ).disableSelection();
});