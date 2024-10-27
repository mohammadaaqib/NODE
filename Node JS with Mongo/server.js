const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

mongoose
  .connect(process.env.CONN_STR, {
    useNewUrlParser: true,
  })
  .then((conn) => {
    // console.log(conn);
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

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

const testMovie = new Movie({
  name: "Die Hard",
  duration: 139,
  description: "Action Packed movie",
  rating: 4.5,
});
testMovie
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log("server is started");
});
