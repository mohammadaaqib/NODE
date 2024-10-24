//Import express
const express = require("express");
const fs = require("fs");
let app = express();

let movies = JSON.parse(fs.readFileSync("./data/movies.json"));
const logger = function (req, res, next) {
  console.log("The request is made");
  next();
};

app.use(express.json());
app.use(logger);

//custom middleware
app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
});

//Route handler Functions
const getAllMovies = (req, res) => {
  res.status(200).json({
    status: "Sucess",
    requestedAt:req.requestedAt,
    count: movies.length,
    data: {
      movies: movies,
    },
  });
};

const getMovie = (req, res) => {
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

const createMovie = (req, res) => {
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

const updateMovie = (req, res) => {
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

const deleteMovie = (req, res) => {
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

// //GET api
// app.get("/api/v1/movies", getAllMovies);
// //Get movie with id
// app.get("/api/v1/movies/:id", getMovie);
// //Post Api
// app.post("/api/v1/movies", createMovie);
// //Patch api
// app.patch("/api/v1/movies/:id", updateMovie);
// // Detele api
// app.delete("/api/v1/movies/:id", deleteMovie);

app.route("/api/v1/movies").get(getAllMovies).post(createMovie);

app
  .route("/api/v1/movies/:id")
  .get(getMovie)
  .patch(updateMovie)
  .delete(deleteMovie);

const port = 3000;
app.listen(port, () => {
  console.log("server is started");
});
