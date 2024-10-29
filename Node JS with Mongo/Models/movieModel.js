const mongoose = require("mongoose");
const validator = require('validator');


const movieschema = new mongoose.Schema({
    name: {
      type: String,
      require: [true, "Name is required"],
      unique: true,
      validate: [validator.isAlpha, "Name should only contain alphabets."]
    },
    description: {
      type: String,
      required: [true, 'Description is required field!'],
      trim: true
  },
  duration: {
      type: Number,
      required: [true, 'Duration is required field!']
  },
  ratings: {
      type: Number,
      
  },
  totalRating: {
      type: Number
  },
  releaseYear: {
      type: Number,
      required: [true, 'Release year is required field!']
  },
  releaseDate:{
      type: Date
  },
  createdAt: {
      type: Date,
      default: Date.now(),
      select: false
  },
  genres: {
      type: [String],
      required: [true, 'Genres is required field!'],
      // enum: {
      //      values: ["Action", "Adventure", "Sci-Fi", "Thriller", "Crime", "Drama", "Comedy", "Romance", "Biography"],
      //      message: "This genre does not exist"
      // }
  },
  directors: {
      type: [String],
      required: [true, 'Directors is required field!']
  },
  coverImage:{
      type: String,
      require: [true, 'Cover image is required field!']
  },
  actors: {
      type: [String],
      require: [true, 'actors is required field!']
  },
  price: {
    type: Number,
    require: [true, 'Price is required field!']
},
createdBy: String
}, {
toJSON: {virtuals: false},
toObject: {virtuals: false}
});
  const Movie = mongoose.model("Movie", movieschema);

  module.exports=Movie;