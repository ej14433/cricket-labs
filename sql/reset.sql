drop table players;
drop table balls;
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