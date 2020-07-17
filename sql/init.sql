
CREATE TABLE teams(
    id INTEGER NOT NULL PRIMARY KEY,
    name TEXT
);

CREATE TABLE matches(
    id INTEGER NOT NULL PRIMARY KEY,
    teamIdHome INTEGER NOT NULL,
    teamIdAway INTEGER NOT NULL,
    gender TEXT,
    season TEXT,
    date TEXT,
    competition TEXT,
    matchNumber INTEGER,
    venue TEXT,
    city TEXT,
    tossWinner INTEGER,
    tossDecision TEXT,
    playerOfMatch INTEGER,
    umpire1 TEXT,
    umpire2 TEXT,
    reserveUmpire TEXT,
    tv_umpire TEXT,
    matchReferee TEXT,
    winner INTEGER,
    winnerWickets TEXT,
    playerPosition1 INTEGER,
    playerPosition2 INTEGER,
    playerPosition3 INTEGER,
    playerPosition4 INTEGER,
    playerPosition5 INTEGER,
    playerPosition6 INTEGER,
    playerPosition7 INTEGER,
    playerPosition8 INTEGER,
    playerPosition9 INTEGER,
    playerPosition10 INTEGER
);

CREATE TABLE players(
    id INTEGER NOT NULL PRIMARY KEY,
    team TEXT,
    firstname TEXT,
    surname TEXT,
    bowlerType TEXT   
);

CREATE TABLE balls(
    id INTEGER NOT NULL PRIMARY KEY, 
    matchId INTEGER,
    inning TEXT,
    over TEXT,
    team TEXT,
    playerPosition1 INTEGER,
    playerPosition2	INTEGER,
    bowler INTEGER,
    runs INTEGER,
    extras INTEGER,
    out TEXT,
    catcher INTEGER
);