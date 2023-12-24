const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (req, res) => {
    const blogs = await Blog.find({});
    res.json(blogs);
});

blogsRouter.get("/:id", async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog) {
            res.json(blog);
        } else {
            res.status(404).end();
        };
    } catch (error) {
        next(error);
    };
});

blogsRouter.post("/", async (req, res, next) => {
    const blog = new Blog(req.body);

    if (!blog.likes) {
        blog.likes = 0;
    };

    try {
        const result = await blog.save();
        res.status(201).json(result);
    } catch (error) {
        next(error);
    };
});

blogsRouter.delete("/:id", async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (error) {
        next(error);
    };
});

blogsRouter.put("/:id", async (req, res) => {
    const body = req.body;

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    };

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true });
        res.status(201).json(updatedBlog);
    } catch (error) {
        next(error);
    };
});

module.exports = blogsRouter;
