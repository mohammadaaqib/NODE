const Movie = require("./../Models/movieModel");

//Route handler Functions
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json({
      status: "Success",
      lenght: movies.length,
      data: {
        movies,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      message: err.message,
    });
  }
};

exports.getMovie = async (req, res) => {
  try {
    const movie = await Movie.find({ _id: req.params.id });
    res.status(200).json({
      status: "Success",
      data: {
        movie,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "Fail",
      message: err.message,
    });
  }
};

exports.createMovie = async (req, res) => {
  // const testMovie=new Movie({

  // });
  // testMovie.save()

  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({
      status: "Success",
      data: {
        movie,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err.message,
    });
  }
};

exports.updateMovie = async (req, res) => {
  try {
  const upadtedmovie= await  Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: "Success",
      data: {
        upadtedmovie,
      },
    });
  } catch (err) {

    res.status(400).json({
      status: "Fail",
      message: err.message,
    });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const upadtedmovie= await  Movie.findByIdAndDelete(req.params.id);
  
      res.status(204).json({
        status: "Success",
        data: null
      });
    } catch (err) {
  
      res.status(400).json({
        status: "Fail",
        message: err.message,
     

})
}
};
