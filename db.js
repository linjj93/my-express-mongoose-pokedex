const mongoose = require("mongoose");

const dbURI = global.__MONGO_URI__ || "mongodb://localhost:27017/pokedex";

mongoose.connect(dbURI, { useNewUrlParser: true });
mongoose.set("useFindAndModify", false);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("connected to MongoDB");
});
