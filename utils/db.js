// db.js
var spicedPg = require('spiced-pg');
var db = spicedPg('postgres:postgres:postgres@localhost:5432/petition');


module.exports.getCities = function getCities() {
    return db.query('SELECT * FROM cities'); //accepts two arguments. the first one is the query
};
//this is how we insert a new row
exports.addCity = function addCity(city, population) { //accepts two arguments. the first one is the query
    return db.query('INSERT INTO cities (city, population) VALUES ($1, $2)',
        [ city, population]); //this array will look exactly like the arguments from the function
};

module.exports.getPetition = function getPetition() {
    return db.query('SELECT * FROM petition'); //accepts two arguments. the first one is the query
};
//number of signed people
module.exports.getNumber = function getNumber(id) {
    return db.query('SELECT id FROM petition VALUES ($1)'); //accepts two arguments. the first one is the query
};
//ask for names
module.exports.getNames = function getNames(firstname, lastname) {
    return db.query('SELECT firstname, lastname FROM petition'); //accepts two arguments. the first one is the query
};
//this is how we insert a new row
exports.addPetition = function addPetition(firstname, lastname, signature) { //accepts two arguments. the first one is the query
    return db.query('INSERT INTO petition (firstname, lastname, signature) VALUES ($1, $2, $3)',
        [ firstname, lastname, signature]); //this array will look exactly like the arguments from the function
};
