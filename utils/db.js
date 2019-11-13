// db.js
const spicedPg = require('spiced-pg');

const db = spicedPg(process.env.DATABASE_URL || 'postgres:postgres:postgres@localhost:5432/petition');

//number of signed people
module.exports.getSignature = function getSignature(id) {
    return db.query('SELECT * FROM signatures WHERE id = $1', [id]); //accepts two arguments. the first one is the query
};
exports.addUsers = function addSignature(signature) { //accepts two arguments. the first one is the query
    return db.query('INSERT INTO users (signature) VALUES ($1) RETURNING id',
        [ signature]); //this array will look exactly like the arguments from the function
};
//ask for names
module.exports.getNames = function getNames() {
    return db.query('SELECT firstname, lastname FROM users'); //accepts two arguments. the first one is the query
};
//this is how we insert a new row
exports.addUsers = function addUsers(firstname, lastname, email, password) { //accepts two arguments. the first one is the query
    return db.query('INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING id',
        [ firstname, lastname, email, password]); //this array will look exactly like the arguments from the function
};

exports.addPetition = function addPetition(firstname, lastname, signature) { //accepts two arguments. the first one is the query
    return db.query('INSERT INTO petition (firstname, lastname, signature) VALUES ($1, $2, $3) RETURNING id',
        [ firstname, lastname, signature]); //this array will look exactly like the arguments from the function
};
exports.addProfile = function addProfile(age, city, url) { //accepts two arguments. the first one is the query
    return db.query('INSERT INTO user_profiles (age, city, url) VALUES ($1, $2, $3) RETURNING id',
        [ age, city, url]); //this array will look exactly like the arguments from the function
};


// module.exports.getPetition = function getPetition() {
//     return db.query('SELECT * FROM petition'); //accepts two arguments. the first one is the query
// };
// module.exports.getCities = function getCities() {
//     return db.query('SELECT * FROM cities'); //accepts two arguments. the first one is the query
// };
// //this is how we insert a new row
// exports.addCity = function addCity(city, population) { //accepts two arguments. the first one is the query
//     return db.query('INSERT INTO cities (city, population) VALUES ($1, $2)',
//         [ city, population]); //this array will look exactly like the arguments from the function
// };


//how ot JOIN tables
//SELECT singers.id AS "singerId", singers.name AS singer_name, songs.name AS song_name
//FROM singer
//JOIN songs
// PULL OUTER JOIN songs
//ON singers.id = songs.singer_id;

//how to JOIN the left table (the first one)
//SELECT singers.id AS "singerId", singers.name AS singer_name, songs.name AS song_name
//FROM singer
//JOIN songs
// LEFT JOIN songs
//ON singers.id = songs.singer_id;
// (WHERE singer.id = 2)
//
// how to triple join
//SELECT singers.id, singers.name AS singer_name, songs_name AS song_name. albums.name AS albums
//FROM singer
// LEFT JOIN songs
// ON singers.id = songs.singer_id
// JOIN albums
// ON songs.id = albums.song_id;
