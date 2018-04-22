var express = require('express');

var UserModel = require('./../models/user');

var router = express.Router();

//send user their home page
router.get("/:id", isLoggedIn, function(req, res){
  //find user in db
  UserModel.findById(req.user._id).populate("clubs").exec(function(err, user){
    if (err) {
      res.redirect("/home");
    } else {
      //show them their page
      res.render("user/home", {user: user});
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
