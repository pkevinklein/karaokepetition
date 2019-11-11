const bcrypt = require('bcryptjs');
const { promisify } = require('util');

const hash = promisify(bcrypt.hash);
const genSalt = promisify(bcrypt.genSalt); // this gives the random string
// qill cabe called in the post registration route
exports.hash = password => genSalt().then(
    salt => hash(password, salt)
);

// will be called in the post login route
exports.compare = promisify(bcrypt.compare);
// compare takes 2 arguments
//1.- is the password user sends fromt he client (browser)
//2.- the hashed password from the database
