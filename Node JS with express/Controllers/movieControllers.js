

const fs = require("fs");

let movies = JSON.parse(fs.readFileSync("./data/movies.json"));

//Route handler Functions
exports.getAllMovies = (req, res) => {
    res.status(200).json({
      status: "Sucess",
      requestedAt:req.requestedAt,
      count: movies.length,
      data: {
        movies: movies,
      },
    });
  };
  
  exports.getMovie = (req, res) => {
    // console.log(req.params);
    const id = +req.params.id;
    const resMovie = movies.find((obj) => obj.id == id);
  
    if (resMovie) {
      res.status(200).json({
        status: "success",
        data: {
          movie: resMovie,
        },
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "move with that id is not found",
      });
    }
  };
  
  exports.createMovie = (req, res) => {
    const newId = movies[movies.length - 1].id + 1;
    const newMovie = Object.assign({ id: newId }, req.body);
    movies.push(newMovie);
    fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
      res.status(201).json({
        status: "sucess",
        data: {
          movie: newMovie,
        },
      });
    });
  
    //   res.send("created");
  };
  
  exports.updateMovie = (req, res) => {
    const id = req.params.id * 1;
    const movieToUpdate = movies.find((obj) => obj.id === id);
  
    if (!movieToUpdate) {
      return res.status(404).json({
        status: "fail",
        message: "move with that id is not found",
      });
    }
  
    const movieIndex = movies.indexOf(movieToUpdate);
    movies[movieIndex] = Object.assign(movieToUpdate, req.body);
    fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
      res.status(200).json({
        status: "success",
        data: {
          movie: movieToUpdate,
        },
      });
    });
  };
  
  exports.deleteMovie = (req, res) => {
    const id = +req.params.id;
    const movieToDelete = movies.find((obj) => obj.id === id);
    if (!movieToDelete) {
      return res.status(404).json({
        status: "fail",
        message: "move with that id is not found",
      });
    }
    const movieIndex = movies.indexOf(movieToDelete);
  
    movies.splice(movieIndex, 1);
    fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
      res.status(204).json({
        status: "success",
        data: {
          movie: null,
        },
      });
    });
  };

