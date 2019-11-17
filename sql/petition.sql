-- DROP TABLE IF EXISTS petition;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS signatures CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    -- get rid of first and last!
    signature TEXT, --NOT NULL CHECK(signature != ''),
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE user_profiles(
     id SERIAL PRIMARY KEY,
     age INT ,
     city VARCHAR(55) ,
     url VARCHAR(55) ,
     user_id INT REFERENCES users(id) NOT NULL UNIQUE
 );
 -- CREATE TABLE petition (
 --     id SERIAL PRIMARY KEY,
 --     firstname VARCHAR(50),
 --     lastname VARCHAR(50),
 --     signature TEXT
 -- );
