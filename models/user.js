  var mongoose              = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

//user model
var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  clubs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "club"
    }
  ],
  location: {
    address: String,
    latitude: Number,
    longitude: Number
  },
  created:
    {type: Date, default: Date.now}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userSchema);
