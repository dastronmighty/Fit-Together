var mongoose = require('mongoose');

var clubSchema = new mongoose.Schema({
  name: String,
  description: String,
  thumbnail: String,
  creator:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  meetups:[
    {
      time:
        {
          day: String,
          time: String
        },
      location:
        {
          address: String,
          longitude: Number,
          latitude: Number
        }
    }
  ],
  members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      }
  ]
});

module.exports = mongoose.model("club", clubSchema);
