var express   = require('express'),
    request   = require('request'),
    passport  = require('passport');

var User = require('./../models/user');

var router = express.Router();

router.get("/register", function(req, res){
  res.render("auth/register");
});

//handel signup
router.post("/register", function(req, res){
  var address = "";
  addresses = [req.body.addressLine1, req.body.addressLine2, req.body.addressLine3];
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
      var newUser = new User({
        username: req.body.username,
        location: {
          address: address,
          latitude: lat,
          longitude: lng
        }
      });
      User.register(newUser, req.body.password, function(err, user){
        if (err) {
          console.log(err);
          res.render("auth/register");
        }else{
          passport.authenticate("local")(req, res, function(){
            res.redirect("/users/"+user._id);
          });
        }
      });
    }else{
      console.log(error);
    }
  });
});

router.get("/login", function(req, res){
  res.render("auth/login");
});

router.post("/login",
  passport.authenticate("local",{
    successRedirect: "/login/success",
    failureRedirect: "/login"
  })
);

router.get("/login/success", function(req, res){
  res.redirect("/users/"+req.user.id);
});

router.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});


function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
};

module.exports = router;
