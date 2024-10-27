const Movie = require("./../Models/movieModel");



//Route handler Functions
exports.getAllMovies = (req, res) => {};

exports.getMovie = (req, res) => {};

exports.createMovie = async (req, res) => {
  // const testMovie=new Movie({

  // });
  // testMovie.save()

  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({
      status:"Success",
      data:{
        movie
      }
    }) 
  
  } catch (err) {
    res.status(400).json({
      status:"Fail",
     message:err.message
    })

  }
};

exports.updateMovie = (req, res) => {};

exports.deleteMovie = (req, res) => {};
