// db.js
const spicedPg = require('spiced-pg');

const db = spicedPg(process.env.DATABASE_URL || 'postgres:postgres:postgres@localhost:5432/petition');

//number of signed people
module.exports.getSignature = function getSignature(user_id) {
    return db.query('SELECT * FROM signatures WHERE user_id = $1', [user_id]); //accepts two arguments. the first one is the query
};
exports.addSignature = function addSignature(signature, user_id) { //accepts two arguments. the first one is the query
    return db.query('INSERT INTO signatures (signature, user_id) VALUES ($1, $2) RETURNING id',
        [signature, user_id]); //this array will look exactly like the arguments from the function
};
//this is how we insert a new row
exports.addUsers = function addUsers(firstname, lastname, email, password) { //accepts two arguments. the first one is the query
    return db.query('INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING id',
        [ firstname, lastname, email, password]); //this array will look exactly like the arguments from the function
};

exports.addProfile = function addProfile(age, city, url, user_id) { //accepts two arguments. the first one is the query
    return db.query('INSERT INTO user_profiles (age, city, url, user_id) VALUES ($1, $2, $3, $4) RETURNING id',
        [ age, city, url, user_id]); //this array will look exactly like the arguments from the function
};
//login
module.exports.getSignedUser = function getSignedUser(email) {
    return db.query('SELECT password FROM users WHERE email = $1', [email]); //accepts two arguments. the first one is the query
};

//ask for names
module.exports.getNames = function getNames() {
    return db.query(`SELECT firstname, lastname, email, age, city, url, signature
    FROM signatures
    JOIN users
    ON user_id = users.id
    LEFT JOIN user_profiles
    ON users.id = user_profiles.user_id`); //accepts two arguments. the first one is the query
};

module.exports.getCity = function getCity(city) {
    return db.query(
        `SELECT firstname, lastname, age, email, city, url FROM signatures
       JOIN users
       ON signatures.user_id = users.id
       LEFT JOIN user_profiles
       ON users.id = user_profiles.user_id
       WHERE LOWER(city) = LOWER($1)`,
        [city]
    );
};
//edit profile
module.exports.getEditProfile = function getEditProfile(id) {
    return db.query(
        `SELECT users.id AS users_id, firstname, lastname, age, city, email, url FROM users
       LEFT JOIN user_profiles
       ON users.id = user_profiles.user_id
       WHERE users.id = $1`,
        [id]
    );
};

module.exports.editProfile = function editProfile(id) {
    return db.query(
        `SELECT users.id AS users_id, firstname, lastname, age, city, email, url FROM users
       LEFT JOIN user_profiles
       ON users.id = user_profiles.user_id
       WHERE users.id = $1`,
        [id]
    );
};
//editing PROFILE
module.exports.updateUser = function updateUser(firstname, lastname, email, user_id) {
    return db.query(
        `UPDATE users SET (firstname, lastname, email)
        VALUES ($1,$2,$3)
        ON CONFLICT (id)
        DO UPDATE SET firstname = $1, lastname = §2, email = $3;`, [firstname, lastname, email, user_id]
    );
};
module.exports.updateUserPass = function updateUserPass(firstname, lastname, email, password, user_id) {
    return db.query(
        `UPDATE users SET (firstname, lastname, email, password)
        VALUES ($1,$2,$3)
        ON CONFLICT (id)
        DO UPDATE SET firstname = $1, lastname = §2, email = $3, password = $4;`, [firstname, lastname, email, user_id]
    );
};
module.exports.updateUserProfile = function updateUserProfile(age, city, url, user_id) {
    return db.query(
        `UPDATE users SET (age, city, url)
        VALUES ($1,$2,$3)
        ON CONFLICT (id)
        DO UPDATE SET age = $1, city = §2, url = $3;`, [age, city, url, user_id]
    );
};


// exports.addPetition = function addPetition(firstname, lastname, signature) { //accepts two arguments. the first one is the query
//     return db.query('INSERT INTO petition (firstname, lastname, signature) VALUES ($1, $2, $3) RETURNING id',
//         [ firstname, lastname, signature]); //this array will look exactly like the arguments from the function
// };


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

//if the user is logged out, he or she can go to two pages only: register(get and post) or login page(get ad post)
//the suer must have signed to see the thank you page,
//if you have not signed, you can only see
