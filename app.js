const express = require("express");
const app = express();
const pokemonRouter = require("./routes/pokemon.route");

app.use(express.json());
app.get("/", (req, res) => res.send("Hello World!"));
app.use("/pokemon", pokemonRouter);

// Error Handler
app.use((err, req, res, next) => {
  console.log("error", err);
  res.sendStatus(500);
});

module.exports = app;
