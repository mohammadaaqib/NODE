const Movie = require("./../Models/movieModel");
const ApiFeatures=require("./../Utils/ApiFeatures")

//Route handler Functions
exports.getAllMovies = async (req, res) => {

  try {
  const feature= new ApiFeatures(Movie.find(),req.query).sort().limiting().paggination();
  let movies=await feature.query;
  //  let query = Movie.find();

    //sorting logic
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(",").join(" ");
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort("-createdAt");
    // }
    //Limiting fields
    // if (req.query.fields) {
    //   console.log(req.query.fields);
    //   const fields = req.query.fields.split(",").join(" ");
    //   console.log(fields);
    //   query = query.select(fields);
    // } else {
    //   query = query.select("-__v");
    // }

    //Pagination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 10;
    // let skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);

   // const movies = await query;
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
    const upadtedmovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

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
    const upadtedmovie = await Movie.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "Success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err.message,
    });
  }
};
