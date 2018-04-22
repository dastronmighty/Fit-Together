var express = require('express');

var ClubModel = require("./../models/club"),
    UserModel = require("./../models/user");

var router = express.Router();

//root route
router.get("/", function(req, res){
  if (req.isAuthenticated()) {
    res.render("misc/landing", {  user: true, userData: req.user });
  }else{
    fakedata = {
      id: 0,
      location: {
        latitude: 0,
        longitude: 0
      }
    };
    res.render("misc/landing", {  user: false, userData: fakedata });
  }
});


//home route
router.get("/home", function(req, res){
  //get clubs
  ClubModel.find({}, function(err, clubs){
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      //check if user authenticate
      if(req.isAuthenticated()){
        //render the page with infor
        res.render("misc/home", {  user: true, clubs: clubs, userData: req.user });
      } else {
        fakedata = {
          id: 0,
          location: {
            latitude: 0,
            longitude: 0
          }
        };
        //render the page with info
        res.render("misc/home", { clubs: clubs, user: false, userData: fakedata });
      }
    }
  });
});

router.get("/about", function(req, res){
  if (req.isAuthenticated()) {
    res.render("misc/about", {  user: true, userData: req.user });
  }else{
    fakedata = {
      id: 0,
      location: {
        latitude: 0,
        longitude: 0
      }
    };
    res.render("misc/about", {  user: false, userData: fakedata });
  }
});

module.exports = router;
