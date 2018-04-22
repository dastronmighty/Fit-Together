var express = require('express'),
    request = require('request');

var ClubModel = require("./../models/club");
var UserModel = require("./../models/user");

var router = express.Router();

//send the user the create new club page
router.get("/new", isLoggedIn, function(req, res){
  res.render("clubs/new", {user: req.user});
});

//send the user the show single club page
router.get("/:id", function(req, res){
  //find club
  ClubModel.findById(req.params.id).populate("members").exec(function(err, club){
    if (err) {
      console.log(err);
      res.redirect("/home");
    } else {
      if(req.isAuthenticated()){
        //render the page with info
        res.render("clubs/show", {  user: true, club: club, userData: req.user });
      } else {
        fakedata = {
          id: 0,
          location: {
            latitude: 0,
            longitude: 0
          }
        };
        res.render("clubs/show", {  user: false, club: club, userData: fakedata });
      }
    }
  });
});

//add the club to the users clubs
router.get("/add/:id", isLoggedIn, function(req, res){
  //find club
  ClubModel.findById(req.params.id, function(err, club){
    if (err) {
      console.log(err);
      res.redirect("/home");
    } else {
      //find user
      UserModel.findById(req.user.id, function(err, user){
        if (err) {
          console.log(err);
          res.redirect("/home");
        } else {
          //check if the user is already in the club
          var isIn = false;
          for (var i = 0; i < user.clubs.length; i++) {
            if (club._id.toString() === user.clubs[i].toString()) {
              var isIn = true;
            }
          }
          if (!isIn) {
            //add club to the users club
            club.members.push(req.user.id);
            club.save();
            user.clubs.push(club);
            user.save();
          }
          res.redirect("/users/"+req.user.id);
        }
      });
    }
  });
});

//handle adding new club to db
router.post("/", isLoggedIn, function(req, res){
  //<===FIND=CO-ORDINATES===>
  var address = "";
  addresses = [req.body.address1, req.body.address2, req.body.address3];
  for (var i = 0; i < 3; i++) {
    if (addresses[i] != "") {
      var addrSplit = addresses[i].split(" ");
      for (var j = 0; j < addrSplit.length; j++) {
        address+=addrSplit[j]+"+";
      }
    }
  }
  address = address.substring(0, (address.length - 1));
  //find coordinates from address
  request("https://maps.googleapis.com/maps/api/geocode/json?address="+address+"&key=AIzaSyDP58C-HPFfTe5roxhSnmZmgy5zZNcYnw4",
  function(error, response, body) {
    if (!error && response.statusCode == 200) {
      info = JSON.parse(body);
      var lat = parseFloat(info.results[0].geometry.location.lat);
      var lng = parseFloat(info.results[0].geometry.location.lng);
      var meetup = {
        time:
          {
            day: req.body.day,
            time: req.body.time
          },
        location:
          {
            address: address,
            latitude: lat,
            longitude: lng
          }
      };
      //create a new club
      var newClub = new ClubModel({
        name: req.body.name
      });
      newClub.creator = req.user.id;
      newClub.members.push(req.user.id);
      var description = req.sanitize(req.body.description);
      newClub.description = description;
      newClub.thumbnail = req.body.thumbnail;
      newClub.meetups.push(meetup);
      //add newclub to database
      ClubModel.create(newClub, function(err, ret){
        if (err){
          console.log(err);
          res.redirect("/clubs/new");
        }else{
          //add the creator as a member
          UserModel.findById(req.user.id, function(err, user){
            user.clubs.push(ret._id);
            user.save();
            //redirect the user home
            res.redirect("/home");
          });
        }
      });
    }else{
      console.log(error);
    }
  });
});

//check if the user is logged in 
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
};

module.exports = router;
