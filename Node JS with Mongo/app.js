//Import express
const express = require("express");
const morgan = require("morgan");
const movieRouter = require("./Routes/movieRoutes");
const customError = require("./Utils/CustomError");
const globalErrorHandler = require("./Controllers/errorController");

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
  // res.status(404).json({
  //   status: "Fail",
  //   message: `Can't find${req.originalUrl} on the server `,
  // // });
  // const err=new Error(`Can't find${req.originalUrl} on the server`);
  // err.status="Fail";
  // err.statusCode=404;
  const err = new customError(
    `Can't find${req.originalUrl} on the server`,
    404
  );
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
