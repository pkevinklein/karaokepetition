DROP TABLE IF EXISTS petition;

CREATE TABLE petition (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    signature TEXT
);
