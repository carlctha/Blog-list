const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const usersInDb = require("./helper");

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

        const res = await api.post("/api/blogs")
            .send(testBlog)
            .expect(201);
        
        expect(res.body.title).toBe(testBlog.title);
        expect(res.body.author).toBe(testBlog.author);
        expect(res.body.url).toBe(testBlog.url);
        expect(res.body.likes).toBe(testBlog.likes);
    });

    test("Default likes to 0", async () => {
        const testBlog = {
            title: "Test blog",
            author: "Ben",
            url: "https://example.com/pythonic-clean-code",
            likes: ""
        };

        const res = await api.post("/api/blogs")
            .send(testBlog)
            .expect(201);

        expect(res.body.likes).toBe(0);
    });

    test("missing title 400 Bad request", async () => {
        const testBlog = {
            title: "",
            author: "Ben",
            url: "https://example.com/pythonic-clean-code",
            likes: ""
        };

        await api.post("/api/blogs")
            .send(testBlog)
            .expect(400);
    });

    test("missing author 400 Bad request", async () => {
        const testBlog = {
            title: "Test blog",
            author: "",
            url: "https://example.com/pythonic-clean-code",
            likes: ""
        };

        await api.post("/api/blogs")
            .send(testBlog)
            .expect(400);
    });

    test("missing url 400 Bad request", async () => {
        const testBlog = {
            title: "Test blog",
            author: "Ben",
            url: "",
            likes: ""
        };

        await api.post("/api/blogs")
            .send(testBlog)
            .expect(400);
    });
});

describe("Delete tests", () => {
    test("delete request", async () => {
        const res = await api.get("/api/blogs");
        const id = res.body[2].id;

        await api.delete(`/api/blogs/${id}`)
            .expect(204);

        const newRes = await api.get("/api/blogs");
        const deleted = newRes.body.find(
            blog => blog.id === id
        );
        expect(deleted).toBeUndefined();
    });
});

describe("Put tests", () => {
    test("find and update", async () => {
        const getRes = await api.get("/api/blogs");
        const id = getRes.body[0].id;
        const updateBlog = {
            title: "Däjs",
            author: "Benjamin Ingrosso",
            url: "https://sv.wikipedia.org/wiki/Bananer_i_pyjamas",
            likes: 23,
        };

        const postRes = await api.put(`/api/blogs/${id}`)
            .send(updateBlog)
            .expect(201);
        
        expect(postRes.body.title).toBe(updateBlog.title);
        expect(postRes.body.author).toBe(updateBlog.author);
        expect(postRes.body.url).toBe(updateBlog.url);
        expect(postRes.body.likes).toBe(updateBlog.likes);
    });
});

describe("users tests", () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash("secret", 10);
        const user = new User({
            username: "Ben",
            passwordHash
        });

        await user.save()
    });

    test("create user", async () => {
        const startingUsers = await usersInDb();

        const newUser = {
            username: "Däjs",
            name: "Barack Obama",
            password: "Manamadäjs"
        };

        await api.post("/api/users")
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const endUsers = await usersInDb();
        expect(endUsers).toHaveLength(startingUsers.length + 1);

        const usernames = endUsers.map(u => u.username);
        expect(usernames).toContain(newUser.username);
    });

    test("short username", async () => {
        const newUser = {
            username: "Dä",
            name: "Barack Obama",
            password: "Manamadäjs"
        };

        const res = await api.post("/api/users")
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(res.body.error).toContain("Username must be at least 3 characthers");
    });

    test("short password", async () => {
        const newUser = {
            username: "Däjs",
            name: "Barack Obama",
            password: "B"
        };

        const res = await api.post("/api/users")
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        expect(res.body.error).toContain("Password must be at least 3 characthers");
    });

    test("already in db", async () => {
        const startingUsers = await usersInDb();

        const newUser = {
            username: "Ben",
            name: "manama däjs",
            password: "12312312"
        };

        await api.post("/api/users")
            .send(newUser)
            .expect(401);

        const endUsers = await usersInDb();
        expect(endUsers).toBe(startingUsers);
    });

});

afterAll(async () => {
    await mongoose.connection.close();
});
