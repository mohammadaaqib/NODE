//Import express
const express = require("express");
const morgan = require("morgan");
const movieRouter = require("./Routes/movieRoutes");

let app = express();

const logger = function (req, res, next) {
  console.log("The request is made");
  next();
};

app.use(express.json());
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}
app.use(express.static("./public"));
app.use(logger);

//custom middleware
app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
});

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
// Middle ware to use route
app.use("/api/v1/movies", movieRouter);
//For error urls  middleware
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "Fail",
    message: `Can't find${req.originalUrl} on the server `,
  });
  next();
});

module.exports = app;
