-- WHERE oscar > 1;

DROP TABLE IF EXISTS actors;

CREATE TABLE actors (
    name VARCHAR(25) PRIMARY KEY,
    age INT,
    Number_of_Oscars INT
);

-- ALTER TABLE actors ADD COLUMN population INTEGER;

-- ALTER TABLE actors DROP COLUMN age;

INSERT INTO actors (name, Age, number_of_oscars) VALUES ('Leonardo DiCaprio', 41, 1);
INSERT INTO actors (name, Age, number_of_oscars) VALUES ('Jennifer Lawrence', 25, 1);
INSERT INTO actors (name, Age, number_of_oscars) VALUES ('Samuel L. Jackson', 67, 0);
INSERT INTO actors (name, Age, number_of_oscars) VALUES ('Meryl Streep', 66, 3);
INSERT INTO actors (name, Age, number_of_oscars) VALUES ('John Cho', 43, 0);

SELECT name, age, number_of_oscars FROM actors;
SELECT * FROM actors WHERE number_of_oscars > 1;
SELECT * FROM actors WHERE age > 30;
