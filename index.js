const express = require("express");
const app = express();
const db = require("./utils/db");
const hb = require("express-handlebars");
const path = require('path');
const cookieSession = require("cookie-session");
const csurf = require("csurf");
// importing both functions from bcrypt
const {hash, compare} = require("./utils/bc");

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
    // res.setHeader_('x-freame-options', 'DENY');
    res.locals.csrfToken = req.csrfToken();
    // res.locals.firstName = req.session.fisrtName; //to saly hello to the name of the client
    next();
});
app.get("/", (req, res) => {
    res.redirect("/petition");
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
    let signature = req.body["signature"];
    if(firstName == "" || lastName == ""|| !signature){
        res.redirect("/petition");
        $(".oops").show();
    } else{
        db.addPetition(firstName, lastName, signature)
            .then(()=>{
                console.log("succesfully added");
                console.log("req.body: ", req.body.lastName);
                res.render("thanks",{ //first argument is where we are going to go
                    layout: "petition"
                })
                    .catch(err =>{
                        console.log("addCity error: ", err);
                    });
            });
        // db.getNumber()
        //     .then(({ rows }) => {
        //         console.log("number: ", rows);
        //         res.send(({ rows }));
        //     })
        //     .catch(err => {
        //         console.log("number error: ",err);
        //     });
    }
});
app.get("/petition",(req,res)=> {
    db.getPetition()

        .then(({ rows }) => {
            console.log("rows: ", rows);
            res.send(({ rows }));
        })
        // rows is the ONLY property of results that we care about
        // rows contains the actual data that we requested from the table
        .catch(err => {
            console.log("cities error: ",err);
        });
});
app.get("/signednames",(req,res)=> {
    db.getNames()
        .then(({ rows }) => {
            console.log("names: ", rows);
            res.send(({ rows }));
        })
        // rows is the ONLY property of results that we care about
        // rows contains the actual data that we requested from the table
        .catch(err => {
            console.log("names error: ",err);
        });
});

//password
app.get("/register", (req, res) =>{
    hash("hello").then(hashPassword => {
        console.log("hash: ", hashPassword);
        res.redirect("/");
    });
});

app.post("/add-city",(req, res)=>{
    db.addCity('Nigeria', 700000)
        .then(()=>{
            console.log("succesfully added");
        })
        .catch(err =>{
            console.log("addCity error: ", err);
        });
});
app.get("/cities",(req,res)=> {
    db.getCities()

        .then(({ rows }) => {
            console.log("rows: ", rows);
            res.send(({ rows }));
        })
        // rows is the ONLY property of results that we care about
        // rows contains the actual data that we requested from the table
        .catch(err => {
            console.log("cities error: ",err);
        });
});




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
app.listen(8080,() => console.log("listening..."));
