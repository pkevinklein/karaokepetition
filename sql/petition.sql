DROP TABLE IF EXISTS petition;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS signatures CASCADE;

CREATE TABLE petition (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(50),
    lastname VARCHAR(50),
    signature TEXT
);
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
    signature TEXT NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE user_profiles(
     id SERIAL PRIMARY KEY,
     age INT,
     city VARCHAR,
     url VARCHAR,
     user_id INT REFERENCES petition(id) NOT NULL UNIQUE
 );
