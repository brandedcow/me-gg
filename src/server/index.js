const express = require("express");
const app = express();
const path = require("path");

const config = require("./config/constants");

// connect to db
const mongoose = require("mongoose");
try {
  mongoose.connect(
    config.MONGO_URL,
    { useNewUrlParser: true }
  );
  mongoose.set("useCreateIndex", true);
} catch (err) {
  console.log("ERROR", err);
  mongoose.createConnection(config.MONGO_URL);
}

// serve React Application
app.use(express.static("dist"));

// serve static assets
app.use("/assets", express.static(path.join(__dirname, "assets")));

// api routes
const routes = require("./routes");
app.use(routes);

app.listen(process.env.PORT || 8080, () =>
  console.log(`Listening on port ${process.env.PORT || 8080}!`)
);

module.exports = app;
