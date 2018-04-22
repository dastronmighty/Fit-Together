var express = require('express'),
    request = require('request');

var ClubModel = require("./../models/club");
var UserModel = require("./../models/user");

var router = express.Router();

router.get("/new", isLoggedIn, function(req, res){
  res.render("clubs/new", {user: req.user});
});

router.get("/:id", function(req, res){
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

router.get("/:id/edit", isLoggedIn, function(req, res){
  ClubModel.findById(req.params.id, function(err, club){
    if (err) {
      res.redirect("/home");
      console.log(err);
    }else{
      if (club.creator == req.user.id) {
        res.render("clubs/edit", {club: club});
      }else{
        res.redirect("/home");
      }
    }
  });
});

router.get("/add/:id", isLoggedIn, function(req, res){
  ClubModel.findById(req.params.id, function(err, club){
    if (err) {
      console.log(err);
      res.redirect("/home");
    } else {
      UserModel.findById(req.user.id, function(err, user){
        if (err) {
          console.log(err);
          res.redirect("/home");
        } else {
          var isIn = false;
          for (var i = 0; i < user.clubs.length; i++) {
            if (club._id.toString() === user.clubs[i].toString()) {
              var isIn = true;
            }
          }
          if (!isIn) {
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
      var newClub = new ClubModel({
        name: req.body.name
      });
      newClub.creator = req.user.id;
      newClub.members.push(req.user.id);
      var description = req.sanitize(req.body.description);
      newClub.description = description;
      newClub.thumbnail = req.body.thumbnail;
      newClub.meetups.push(meetup);
      ClubModel.create(newClub, function(err, ret){
        if (err){
          console.log(err);
          res.redirect("/clubs/new");
        }else{
          UserModel.findById(req.user.id, function(err, user){
            user.clubs.push(ret._id);
            user.save();
            res.redirect("/home");
          });
        }
      });
    }else{
      console.log(error);
    }
  });
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
};

module.exports = router;
