DROP TABLE IF EXISTS cities;

CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    city VARCHAR(255) NOT NULL UNIQUE CHECK (city != 'Newark'),
    state VARCHAR(255),
    country VARCHAR
);

ALTER TABLE cities ADD COLUMN population INTEGER;

ALTER TABLE cities DROP COLUMN state;

INSERT INTO cities (city, country, population) VALUES ('Berlin', 'Germany', 3610156);
INSERT INTO cities (city, country, population) VALUES ('Hamburg', 'Germany', 1774242);
INSERT INTO cities (city, country, population) VALUES ('Munch', 'Germany', 1450381);
INSERT INTO cities (city, country, population) VALUES ('Tokyo', 'Japan', 13617445);
INSERT INTO cities (city, country, population) VALUES ('Sydney', 'Australia', 4921000);

UPDATE cities SET city = 'Munich' WHERE city = 'Munch' AND country = 'Germany';

DELETE FROM cities WHERE city = 'Tokyo';

SELECT city, population FROM cities;

SELECT city AS town, population AS peeps FROM cities;
