const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", (req, res) => {
    Blog.find({}).then(blogs => {
        res.json(blogs);
    });
});

blogsRouter.get("/:id", (req, res) => {
    Blog.findById(req.params.id).then((blog) => {
        if (blog) {
            res.json(blog);
        } else {
            res.status(404).end();
        };
    });
});

blogsRouter.post("/", (req, res) => {
    const blog = new Blog(req.body);

    blog.save().then(result => {
        res.status(201).json(result);
    });
});

blogsRouter.delete("/:id", (req, res) => {
    Blog.findByIdAndDelete(req.params.id).then(() => {
        res.status(204).end();
    });
});

blogsRouter.put("/:id", (req, res) => {
    const body = req.body;

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    };

    Blog.findByIdAndUpdate(req.params.id, blog, { new: true }).then(blog => {
        res.json(blog);
    });
});

module.exports = blogsRouter;
