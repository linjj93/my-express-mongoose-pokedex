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

  const getPokemonData = index => pokemonData.slice(index, index + 1)[0];

  describe("/pokemon", () => {
    it("GET / should find all pokemon", async () => {
      const collection = db.collection("pokemons");
      await collection.insertMany(pokemonData);

      const response = await request(app).get("/pokemon");
      expect(response.body).toMatchObject(pokemonData);
    });
  });
});
