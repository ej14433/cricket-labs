import sqlite from "sqlite3";
import {
	TeamsEntry,
	MatchesEntry,
	BallsEntry,
	PlayersEntry,
} from "../types/db";

const db = new sqlite.Database("./sql/db.db");

const fieldMap = (fields: string[]) =>
	fields
		.map((field, i) =>
			i === fields.length - 1 ? `${field}` : `${field}, `
		)
		.join("");

const valueFieldMap = (fields: string[]) =>
	fields
		.map((field, i) =>
			i === fields.length - 1 ? `$${field}` : `$${field}, `
		)
		.join("");

export const teamByName = (name: string): Promise<TeamsEntry[]> => {
	return new Promise((resolve, reject) =>
		db.all(
			`SELECT * FROM teams WHERE name=$name`,
			{ $name: name },
			(err, rows: TeamsEntry[]) => {
				if (err) reject(err);
				else resolve(rows);
			}
		)
	);
};

export const createTeam = (name: string) => {
	db.run("INSERT INTO teams (name) VALUES ($name)", { $name: name });
};

export const matchByTeamsAndMatchNumber = (
	team1: string,
	team2: string,
	matchNumber: string
): Promise<MatchesEntry[]> => {
	return new Promise((resolve, reject) =>
		db.all(
			`SELECT * FROM matches WHERE teamIdHome=$team1 AND teamIdAway=$team2 AND matchNumber=$matchNumber`,
			{ $team1: team1, $team2: team2, $matchNumber: matchNumber },
			(err, rows: MatchesEntry[]) => {
				if (err) reject(err);
				else resolve(rows);
			}
		)
	);
};

export const createMatch = (rows: string[][]): Promise<MatchesEntry> => {
	const fields = [
		"teamIdHome",
		"teamIdAway",
		"gender",
		"season",
		"date",
		"competition",
		"matchNumber",
		"venue",
		"city",
		"tossWinner",
		"tossDecision",
		"playerOfMatch",
		"umpire1",
		"umpire2",
		"reserveUmpire",
		"tv_umpire",
		"matchReferee",
		"winner",
		"winnerWickets",
	];

	return new Promise((resolve, reject) => {
		db.all(
			`INSERT INTO 
			matches
			(${fieldMap(fields)}) 
			VALUES 
			(${valueFieldMap(fields)})`,
			{
				$teamIdHome: rows[0][2],
				$teamIdAway: rows[1][2],
				$gender: rows[2][2],
				$season: rows[3][2],
				$date: rows[4][2],
				$competition: rows[5][2],
				$matchNumber: rows[6][2],
				$venue: rows[7][2],
				$city: rows[8][2],
				$tossWinner: rows[9][2],
				$tossDecision: rows[10][2],
				$playerOfMatch: rows[11][2],
				$umpire1: rows[12][2],
				$umpire2: rows[13][2],
				$reserveUmpire: rows[14][2],
				$tv_umpire: rows[15][2],
				$matchReferee: rows[16][2],
				$winner: rows[17][2],
				$winnerWickets: rows[18][2],
			},
			(err, rows: MatchesEntry) => {
				if (err) console.log("createMatch err:\n" + err);
				resolve(rows);
			}
		);
	});
};

export const matchBallByMatch = (
	row: string[],
	matchId: number
): Promise<BallsEntry[]> => {
	return new Promise((resolve, reject) => {
		const sql = `
		SELECT * FROM balls WHERE over=$over AND inning=$inning AND matchId=$matchId
		`;

		const params = {
			$over: row[2],
			$matchId: matchId,
			$inning: row[1],
		};

		db.all(sql, params, (err, rows: BallsEntry[]) => {
			if (err) {
				console.log("matchBallByMatch err: \n" + err);
				reject(err);
			} else return resolve(rows);
		});
	});
};

export const createPlayer = (
	player: string,
	team: string
): Promise<boolean> => {
	const fields = ["team", "firstname", "surname", "bowlerType"];
	const sql = `INSERT INTO players
	(
		${fieldMap(fields)}
			)
			VALUES
			(
				${valueFieldMap(fields)}
					)`;
	const params = {
		$team: team,
		$firstname: player.split(" ")[0],
		$surname: player.split(" ")[1],
	};
	return new Promise((resolve, reject) => {
		db.run(sql, params, (err) => {
			if (err) {
				console.log(err, "createPlayer");
				reject(err);
			} else resolve(true);
		});
	});
};

export const findPlayer = (name: string): Promise<PlayersEntry[]> => {
	const sql = `SELECT * FROM players WHERE firstname=$firstname AND surname=$surname`;
	const params = {
		$firstname: name.split(" ")[0],
		$surname: name.split(" ")[1],
	};

	return new Promise((resolve, reject) => {
		db.all(sql, params, (err, rows) => {
			if (err) {
				console.log(err, "findPlayer");
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
};

export const createBall = (
	row: string[],
	playerIds: number[],
	matchId: number
): Promise<boolean> => {
	const fields = [
		"matchId",
		"inning",
		"over",
		"team",
		"playerPosition1",
		"playerPosition2",
		"bowler",
		"runs",
		"extras",
		"out",
		"catcher",
	];
	const sql = `
		INSERT INTO balls (${fieldMap(fields)}) VALUES (${valueFieldMap(fields)})
	`;

	const params = {
		$matchId: matchId,
		$inning: row[1],
		$over: row[2],
		$team: row[3],
		$playerPosition1: playerIds[0],
		$playerPosition2: playerIds[1],
		$bowler: playerIds[2],
		$runs: row[7],
		$extras: row[8],
		$out: row[9] || null,
		$catcher: playerIds[3] || null,
	};

	return new Promise((resolve, reject) => {
		db.run(sql, params, (err) => {
			if (err) console.log(err, "createBall");
			else resolve(true);
		});
	});
};
