const mongoose = require("mongoose");


const movieschema = new mongoose.Schema({
    name: {
      type: String,
      require: [true, "Name is required"],
      unique: true,
    },
    duration: {
      type: Number,
      require: [true, "Duration is require field"],
    },
    description: String,
    rating: Number,
  });
  
  const Movie = mongoose.model("Movie", movieschema);

  module.exports=Movie;