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





const port = process.env.port || 3000;

app.listen(port, () => {
  console.log("server is started");
});
