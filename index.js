const express = require("express");
const app = express();
module.exports = app;
const db = require("./utils/db");
const hb = require("express-handlebars");
const path = require('path');
const cookieSession = require("cookie-session");
const csurf = require("csurf");
// importing both functions from bcrypt
const {hash, compare} = require("./utils/bc");
// const {requireSignature,
//     requireNoSignature,
//     requireLoggedOutUser} = require("./middleware");
app.use(express.static("./public"));
app.set('views', path.join(__dirname, 'views/'));
app.engine("handlebars", hb());
app.set("view engine", "handlebars");


app.use(express.urlencoded({
    extended: false
}));

app.use(cookieSession({
    secret: `I'm always hungry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14
}));
app.use(csurf());
app.use(function(req, res, next) {
    res.set('x-frame-options', 'deny');
    res.locals.csrfToken = req.csrfToken();
    res.locals.firstName = req.session.firstname; //to saly hello to the name of the client
    next();
});
app.get("/", (req, res) => {
    res.redirect("/home");
});
app.get("/petition", (req,res)=> {
    // console.log("****7/ROUTE****");
    // console.log("req.session before: ", req.session);
    // req.session.habanero = "love";
    // console.log("req.session after: ", req.session.habanero);
    // console.log("****7/ROUTE****");
    res.render("submit",{ //first argument is where we are going to go
        layout: "petition"
    });
});
app.post("/petition",(req, res)=>{
    // console.log("post request made");
    // console.log("req: ", req.body);
    let firstName = req.body["first-name"];
    let lastName = req.body["last-name"];
    let email = req.body["email"];
    let password = req.body["password"];
    console.log(req.body);
    hash(password).then(hashedPassword =>{
        if(firstName == "" || lastName == ""|| !email || !password){
            res.redirect("/petition");
        // $("#oops").show();
        } else{
            db.addUsers(firstName, lastName, email, hashedPassword)
                .then(({rows})=>{
                    let userId = rows[0].id;
                    req.session.user = {
                        id: userId,
                        firstname : firstName,
                        lastname : lastName,
                        email: email,
                    };
                    console.log("succesfully added");
                    //= {rows: }
                    // console.log("req.body: ", req.body);
                    res.redirect("/profile");
                })
                .catch(err =>{
                    console.log("addUsers error: ", err);
                });
        }
    })
        .catch( err =>{
            console.log("password error: ", err);
        });
});

app.get("/thanks", (req,res)=>{

    Promise.all([db.getNames(req.session.user.id),db.getSignature(req.session.user.id)])
        .then( results =>{
            console.log("results: ", results[1].rows);
            res.render("thanks", {
                layout: "petition",
                id: results[0].rowCount,
                img: results[1].rows[0].signature
            });
        }).catch(err =>{
            console.log("promise all error: ", err);
        });

});
//LOG IN
app.get("/login", (req,res)=>{
    res.render("login", {
        layout: "petition",
    });
});
app.post("/login", (req,res)=>{
    let email = req.body["email"];
    let password = req.body["password"];
    if (email == "" || password == ""){
        // window.alert("Oops, better stops singing, or maybe try again🤔");
        res.redirect("/login");
    } else{
        db.getSignedUser(email).then(({rows})=>{
            let hashedPassword = rows[0].password;
            console.log("user's info:", rows, hashedPassword);
            compare(password, hashedPassword)
                .then(match =>{
                    console.log("comparison made");
                    if (match){
                        res.redirect("/thanks");
                    } else {
                        // window.alert("Invalid email address or password!");
                        res.redirect("/login");

                    }
                }).catch(err =>{

                    res.redirect("/login");
                    console.log("match error: ", err);
                });
        });
    }
});
//SIGNATURE
app.get("/signature", (req,res)=>{
    res.render("signature", {
        layout: "petition",
    });
});
app.post("/signature",(req,res)=> {
    let signature = req.body["signature"];

    db.addSignature(signature,req.session.user.id)
        .then(({ rows }) => {
            req.session.signature = rows[0].id;
            console.log("signature added successfully");
            console.log(rows[0].id);
            res.redirect("/thanks");
        })
        // rows is the ONLY property of results that we care about
        // rows contains the actual data that we requested from the table
        .catch(err => {
            console.log("SIGNATURE error: ",err);
        });

});
// Home
app.get("/home", (req,res)=>{
    res.render("home", {
        layout: "petition",
    });
});
// PROFILE
app.get("/profile", (req,res)=>{
    res.render("profile", {
        layout: "petition",
    });
});
app.post("/profile",(req,res)=> {
    let age = req.body["age"];
    let city = req.body["city"];
    let url = req.body["url"];
    let protocol = "http://";
    let proUrl;
    if (url.startsWith("http://") || url.startsWith("https://")){
        proUrl = url;
    } else if (url.startsWith("")){
        proUrl = null;
    } else {
        proUrl = protocol + url;
    }
    if(age === "" && city === "" && url === ""){
        res.redirect("/signature");
    } else{
        db.addProfile(age, city, proUrl, req.session.user.id)
            .then(({ rows }) => {
                console.log("PROFILE: ", rows);
                res.redirect("/signature");
            })
            // rows is the ONLY property of results that we care about
            // rows contains the actual data that we requested from the table
            .catch(err => {
                console.log("PROFILE error: ",err);
            });
    }
});
////// SIGNED NAMES
app.get("/signednames",(req,res)=> {
    db.getNames()
        .then(({ rows }) => {
            console.log("names: ", rows.length);
            res.render("signednames",{
                layout: "petition",
                names: rows
            });
        })
        // rows is the ONLY property of results that we care about
        // rows contains the actual data that we requested from the table
        .catch(err => {
            console.log("names error: ",err);
        });
});
// SIGNED NAMES BY CITY
app.get("/signednames/:city",(req,res) => {
    // let cities = {};
    db.getCity(req.params.city)
        .then(results => {
            let signers = results.rows;
            console.log(signers);
            console.log("signers: ", signers);
            res.render("signednames", {
                layout: "petition",
                signers
            });
        })
        .catch(err => {
            console.log("getCity err: ", err);
        });
});
//edit profile
app.get("/edit",(req,res) => {
    let userId = req.session.user.id;
    console.log("userId:", userId);
    db.getEditProfile(userId)
        .then(({ rows }) => {
            console.log("ROWS: ", rows);
            res.render("edit",{
                layout: "petition",
                names: rows
            });
        })
        .catch(err => {
            console.log("getEditProfile err: ", err);
        });
});
// app.post("/edit",(req,res)=> {
//     let lastname = req.body["lastname"];
//     let firstname = req.body["firstname"];
//     let email = req.body["email"];
//     db.updateUser(firstname, lastname, email, req.session.user.id)
//         .then(({ rows }) => {
//             console.log("update PROFILE: ", rows);
//             res.redirect("/thanks");
//         })
//     // rows is the ONLY property of results that we care about
//     // rows contains the actual data that we requested from the table
//         .catch(err => {
//             console.log("PROFILE error: ",err);
//         });
//
// });
app.post("/profile/edit", (req, res) => {
    // console.log("req.body: ", req.body);
    // console.log("cookie: ", req.session.user);
    let password = req.body["password"];
    let userId = req.session.user.id;


    if (password != "") {
        // if the user changed the password
        hash(password).then(hashedPass => {
            console.log("hash: ", hashedPass);
            // do stuff here...
            Promise.all([
                db.updateUserPass(
                    req.body["first-name"],
                    req.body["last-name"],
                    req.body["email"],
                    hashedPass,
                    userId
                ),
                db.updateUserProfile(
                    req.body["age"],
                    req.body["city"],
                    req.body["url"],
                    userId
                )
            ])
                .then(results => {
                    console.log(
                        "results if the user has updated the password: ",
                        results.rows
                    );
                    // let users = results[0];
                    // let userProfiles = results[1];
                    // let mergeResults = [...users, ...userProfiles];
                    // console.log("merged results with password: ", mergeResults);
                    res.redirect("/thanks");
                })
                .catch(err => {
                    console.log("promise.all err with pass: ", err);
                });
        });
    } else {
        Promise.all([
            db.updateUser(
                req.body["first_name"],
                req.body["last_name"],
                req.body["email"],
                userId
            ),
            db.updateUserProfile(
                req.body["age"],
                req.body["city"],
                req.body["url"],
                userId
            )
        ])
            .then(results => {
                console.log(
                    "results if the user hasn't updated the password: ",
                    results.rows
                );
                res.redirect("/thanks");
            })
            .catch(err =>
                console.log("Promise.all without pass error: ", err)
            );
    }
});
//password
app.get("/register", (req, res) =>{
    hash("hello").then(hashPassword => {
        console.log("hash: ", hashPassword);
        res.redirect("/");
    });
});
app.get("/logout",(req, res)=>{
    req.session === null;
    res.redirect("/login");
});
app.listen(process.env.PORT ||8080,() => console.log("listening..."));


// app.get("/petition",(req,res)=> {
//     db.getPetition()
//         .then(({ rows }) => {
//             console.log("rows: ", rows);
//             res.send(({ rows }));
//         })
//         // rows is the ONLY property of results that we care about
//         // rows contains the actual data that we requested from the table
//         .catch(err => {
//             console.log("cities error: ",err);
//         });
// });





// app.post("/add-city",(req, res)=>{
//     db.addCity('Nigeria', 700000)
//         .then(()=>{
//             console.log("succesfully added");
//         })
//         .catch(err =>{
//             console.log("addCity error: ", err);
//         });
// });
// app.get("/cities",(req,res)=> {
//     db.getCities()
//
//         .then(({ rows }) => {
//             console.log("rows: ", rows);
//             res.send(({ rows }));
//         })
//         // rows is the ONLY property of results that we care about
//         // rows contains the actual data that we requested from the table
//         .catch(err => {
//             console.log("cities error: ",err);
//         });
// });




// app.get("/citiess", (req,res)=> {
//     console.log("****7/ROUTE****");
//     console.log("req.session before: ", req.session);
//     req.session.habanero = "love";
//     console.log("req.session after: ", req.session);
//     console.log("****7/ROUTE****");
//     res.render("submit",{ //first argument is where we are going to go
//         layout: "petition"
//     });
// });
// we want to check if the input field for the website starts with "https://" or "http://". if not, we would add this to the string
