const express = require("express");
const router = express.Router();
require("../db");
require("../pokemon.model");
const mongoose = require("mongoose");
const Pokemon = mongoose.model("Pokemon");
const flatten = require("flat");

// router.use(express.json());

router.get("/", async (req, res) => {
  const foundPokemon = await Pokemon.find();
  res.status(200).json(foundPokemon);
});

router.get("/:id", async (req, res) => {
  const foundPokemon = await Pokemon.findOne({ id: req.params.id });
  res.status(200).json(foundPokemon);
});

router.post("/", async (req, res) => {
  const newPokemon = new Pokemon(req.body);
  await newPokemon.save();
  res.status(201).json(newPokemon);
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const fieldsToUpdate = flatten(req.body);
    await Pokemon.findOneAndUpdate({ id }, fieldsToUpdate);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res) => {
  const deletedPokemon = await Pokemon.findOne({ id: req.params.id });
  await Pokemon.deleteOne({ id: req.params.id });
  res.status(200).json(deletedPokemon);
});

module.exports = router;
