const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

test("in json format", async () => {
    await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);
});

test("correct amount of blogs in db", async () => {
    const res = await api.get("/api/blogs");

    expect(res.body.length).toBe(3);
});

afterAll(async () => {
    await mongoose.connection.close();
});
