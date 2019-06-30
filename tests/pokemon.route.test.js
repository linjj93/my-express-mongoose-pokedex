const pokemonData = require("../data/pokemon.data");
const { MongoClient } = require("mongodb");
const request = require("supertest");
const mongoose = require("mongoose");
require("../db");
const app = require("../app");

describe("Pokemon", () => {
  let connection;
  let db;

  beforeAll(async () => {
    const dbParams = global.__MONGO_URI__.split("/");
    const dbName = dbParams[dbParams.length - 1];
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true
    });
    db = await connection.db(dbName);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await connection.close();
    await db.close();
  });

  beforeEach(async () => {
    await db.dropDatabase();
  });

  it("GET / should return Hello world", async () => {
    const response = await request(app).get("/");
    expect(response.text).toEqual("Hello World!");
  });


  describe("/pokemon", () => {
    it("GET / should find all pokemon", async () => {
      const collection = db.collection("pokemons");
      await collection.insertMany(pokemonData);

      const response = await request(app).get("/pokemon");
      expect(response.body).toMatchObject(pokemonData);
    });

    it("POST / should add new Pokemon", async () => {
      const requestBody = pokemonData[1];

      const response = await request(app)
        .post("/pokemon")
        .send(requestBody)
        .set("Content-Type", "application/json");

      const collection = db.collection("pokemons");
      expect(response.status).toEqual(201);
      const foundPokemon = await collection.findOne({ id: requestBody.id });
      expect(response.body).toMatchObject(requestBody);
      expect(foundPokemon.id).toEqual(requestBody.id);
    });
  });

  describe("/pokemon/:id", () => {
    it("GET /7 should return Squirtle", async () => {
      const collection = db.collection("pokemons");
      await collection.insertMany(pokemonData);

      const response = await request(app).get("/pokemon/7");
      expect(response.body).toMatchObject(pokemonData[0]);
    });

    it("DELETE /6 should remove Charizard", async () => {
      const collection = db.collection("pokemons");
      await collection.insertMany(pokemonData);

      const deletedPokemon = await collection.findOne({
        id: 6
      });
      const response = await request(app).delete("/pokemon/6");
      const deletedPokemonRemains = await collection.findOne({
        id: 6
      });
      expect(response.body).toMatchObject(deletedPokemon);
      expect(response.status).toEqual(200);
      expect(deletedPokemonRemains).toBeFalsy();
    });

    it("PUT /10 should update Caterpie", async () => {
      const collection = db.collection("pokemons");
      await collection.insertMany(pokemonData);
      const fieldsToUpdate = {
        base: {
          HP: 80
        }
      };
      const response = await request(app)
        .put("/pokemon/10")
        .send(fieldsToUpdate)
        .set("Content-Type", "application/json");
      expect(response.status).toEqual(200);
      const updatedPokemon = await collection.findOne({ id: 10 });
      expect(updatedPokemon.base.HP).toEqual(fieldsToUpdate.base.HP);
    });
  });
});
