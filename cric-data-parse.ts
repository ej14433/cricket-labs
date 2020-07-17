import parse from "csv-parse";
import fs from "fs";
import {
	teamByName,
	createTeam,
	matchByTeamsAndMatchNumber,
	createMatch,
	matchBallByMatch,
	createBall,
	createPlayer,
	findPlayer,
} from "./sql/commands";
import { BallsEntry } from "./types/db";

const checkTeams = (rows: string[][]) => {
	[0, 1].forEach((index) => {
		if (rows[index][1] === "team") {
			const teamName = rows[index][2];
			teamByName(teamName)
				.then((res) => {
					if (res.length === 0) createTeam(teamName);
				})
				.catch((err) => console.log(err));
		}
	});
};

const checkMatch = (rows: string[][]): Promise<number> => {
	return matchByTeamsAndMatchNumber(rows[0][2], rows[1][2], rows[6][2]).then(
		(res) => {
			if (res.length === 0)
				return createMatch(rows).then((match) => match.id);
			else return res[0].id;
		}
	);
};

const parseInfoRows = async (rows: string[][]): Promise<number> => {
	checkTeams(rows);
	return await checkMatch(rows);
};

const checkBall = async (
	row: string[],
	matchId: number
): Promise<BallsEntry[]> => {
	return await matchBallByMatch(row, matchId);
};

type NameAndTeam = {
	name: string;
	team: string;
};

const checkPlayers = async (
	playerPosition1: NameAndTeam,
	playerPosition2: NameAndTeam,
	bowler: NameAndTeam,
	catcher?: NameAndTeam
): Promise<number[]> => {
	const ps = [playerPosition1, playerPosition2, bowler, catcher].map(
		async (player) => {
			if (player.name) {
				const rows = await findPlayer(player.name);
				if (rows.length === 0) {
					await createPlayer(player.name, player.team);
					const playerDb = await findPlayer(player.name);
					return playerDb[0].id;
				} else return rows[0].id;
			}
		}
	);
	const ids = await Promise.all(ps).then((res) => res);
	return ids.filter((id) => id && id);
};

const parseBallRows = async (
	rows: string[][],
	matchId: number,
	firstBowlingTeam: string,
	secondBowlingTeam: string
) => {
	for (const row of rows) {
		await checkBall(row, matchId).then(async (balls) => {
			if (balls.length === 0) {
				const bowlerTeam =
					row[1] === "1" ? firstBowlingTeam : secondBowlingTeam;

				return await checkPlayers(
					{ name: row[4], team: row[3] },
					{ name: row[5], team: row[3] },
					{
						name: row[6],
						team: bowlerTeam,
					},
					{
						name: row[10],
						team: bowlerTeam,
					}
				).then(async (playerIds) => {
					await createBall(row, playerIds, matchId);
					return true;
				});
			}
		});
	}
};

const parseRows = async (rows: string[][]) => {
	const infoRows = rows.filter((row) => row[0] === "info");
	const ballRows = rows.filter((row) => row[0] === "ball");

	const tossWinner = infoRows[9][2] === infoRows[0][2] ? 0 : 1;
	const decision = infoRows[10][2];
	const teams = [infoRows[0][2], infoRows[1][2]];

	const firstBowlingTeam =
		decision === "field" ? teams[tossWinner] : teams[1 - tossWinner];
	const secondBowlingTeam =
		decision === "field" ? teams[1 - tossWinner] : teams[tossWinner];

	const matchId = await parseInfoRows(infoRows);
	parseBallRows(ballRows, matchId, firstBowlingTeam, secondBowlingTeam);
};

fs.readFile("cric-data.csv", (err, data) => {
	if (err) throw err;
	parse(data, {}, (err, rows: string[][]) => {
		if (err) throw err;
		parseRows(rows);
	});
});
