var express = require('express');

var UserModel = require('./../models/user');

var router = express.Router();

router.get("/:id", isLoggedIn, function(req, res){
  UserModel.findById(req.user._id).populate("clubs").exec(function(err, user){
    if (err) {
      res.redirect("/home");
    } else {
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
