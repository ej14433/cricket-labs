export interface MatchesEntry {
	id: number;
	teamIdHome: number;
	teamIdAway: number;
	gender: string;
	season: string;
	date: string;
	competition: string;
	matchNumber: number;
	venue: string;
	city: string;
	tossWinner: number;
	tossDecision: string;
	playerOfMatch: number;
	umpire1: string;
	umpire2: string;
	reserveUmpire: string;
	tv_umpire: string;
	matchReferee: string;
	winner: number;
	winnerWickets: string;
	playerPosition1: number;
	playerPosition2: number;
	playerPosition3: number;
	playerPosition4: number;
	playerPosition5: number;
	playerPosition6: number;
	playerPosition7: number;
	playerPosition8: number;
	playerPosition9: number;
	playerPosition10: number;
}

export interface TeamsEntry {
	id: number;
	name: string;
}

export interface BallsEntry {
	id: number;
	matchId: number;
	inning: string;
	over: string;
	team: string;
	playerPosition1: number;
	playerPosition2: number;
	bowler: number;
	runs: number;
	extras: number;
	out: string;
	catcher: number;
}

export interface PlayersEntry {
	id: number;
	team: number;
	firstname: string;
	surname: string;
	bowlerType: string;
}
