//======<requirements>===========
var ip               = require('ip'),
    express          = require('express'),
    request          = require('request'),
    passport         = require('passport'),
    bodyParser       = require('body-parser'),
    User             = require('./models/user'),
    localStrategy    = require('passport-local'),
    methodOverride   = require('method-override'),
    expressSanitizer = require('express-sanitizer');
//======</requirements>===========

//=======<APP SETUP>========
var app = express();

app.set("view engine", "ejs");//use  embeded-javascript

app.use(express.static(__dirname + '/public')); //use public directory to server staic files

app.use(bodyParser.urlencoded({extended: true})); // use body parser
app.use(methodOverride("_method")); //override methods of form (put/delete)
app.use(expressSanitizer());

//=======</APP SETUP>========

//<appauth>
app.use(require('express-session')({
  secret: "46697420546f6765746865722077696c6c20676574206d6520616e2041",
  resave: false,
  saveUninitialized: false
})); //set up an express session
app.use(passport.initialize()); //initialize passport
app.use(passport.session()); //use sessions
passport.use(new localStrategy(User.authenticate())); //use the local strategy
passport.serializeUser(User.serializeUser()); //encryption setup
passport.deserializeUser(User.deserializeUser()); //decryption setup
//</appauth>

//<routes>
var authRoutes    = require('./routes/auth'),
    miscRoutes    = require('./routes/misc'),
    userRoutes    = require('./routes/user'),
    eventRoutes   = require('./routes/clubs');
app.use(authRoutes);
app.use(miscRoutes);
app.use("/users",userRoutes);
app.use("/clubs",eventRoutes);
//</routes>

//<mongoose>
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/fit_together");
//</mongoose>


//any route we havent defined
app.get("*", function(req, res){
  res.render("misc/pagenotfound");
});

//port listener
app.listen('3000', ip.address() , function(){
  console.log("SERVER STARTED!!!");
  var address = ip.address() + ":3000";
  console.log("goto -> "+address);
});
