const express = require("express");
const router = express.Router();
require("../pokemon.model");
const mongoose = require("mongoose");
const Pokemon = mongoose.model("pokemon");

router.get("/", async (req, res) => {
  const foundPokemon = await Pokemon.find();
  res.status(200).json(foundPokemon);
});

module.exports = router;
