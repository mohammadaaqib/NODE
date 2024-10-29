const express = require("express");
const moviesController = require("./../Controllers/movieControllers");

const router = express.Router();

//router.param("id", moviesController.checkId);
router.route("/movie-stats").get(moviesController.movieStats)
router.route("/movies-by-genre/:genre").get(moviesController.movieGenre)
router
  .route("/")
  .get(moviesController.getAllMovies)
  .post(moviesController.createMovie);

router
  .route("/:id")
  .get(moviesController.getMovie)
  .patch(moviesController.updateMovie)
  .delete(moviesController.deleteMovie);

module.exports = router;
