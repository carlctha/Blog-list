const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");

const initialBlogs = [
    {
        title: "Eric Henziger",
        author: "Eric Henziger",
        url: "henziger.se",
        likes: 0,
    },
    {
        title: "Ben",
        author: "Däjs",
        url: "Ben.manamadäjs.js",
        likes: 100,
    },
    {
        title: "Pythonic Ways to Write Clean Code",
        author: "Alex Programmer",
        url: "https://example.com/pythonic-clean-code",
        likes: 25,
    },
];

beforeEach(async () => {
    await Blog.deleteMany({});
    let blogObj = new Blog(initialBlogs[0]);
    await blogObj.save();
    blogObj = new Blog(initialBlogs[1]);
    await blogObj.save();
    blogObj = new Blog(initialBlogs[2]);
    await blogObj.save();
});

const api = supertest(app);

describe("get tests", () => {
    test("in json format", async () => {
        await api
            .get("/api/blogs")
            .expect(200)
            .expect("Content-Type", /application\/json/);
    });

    test("correct amount of blogs in db", async () => {
        const res = await api.get("/api/blogs");

        expect(res.body.length).toBe(initialBlogs.length);
    });

    test("id is defined", async () => {
        const res = await api.get("/api/blogs");

        const blogs = res.body.filter(blog => blog.id);

        expect(blogs.length).toBe(res.body.length);
    });
});

describe("Post tests", () => {
    test("create blog recommendation", async () => {
        const testBlog = {
            title: "Test blog",
            author: "Ben",
            url: "https://example.com/pythonic-clean-code",
            likes: 100
        };

        const res = api.post("/api/blogs")
            .send(testBlog)
            .expect(201);

        expect(res._data.title).toBe(testBlog.title);
        expect(res._data.author).toBe(testBlog.author);
        expect(res._data.url).toBe(testBlog.url);
        expect(res._data.likes).toBe(testBlog.likes);
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});
