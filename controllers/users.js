const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (req, res) => {
    const { username, name, password } = req.body;

    if (username.length < 3) {
        res.status(400).json({ error: "Username must be at least 3 characthers" });
    };

    if (password.length < 3) {
        res.status(400).json({ error: "Password must be at least 3 characthers" });
    };

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        username,
        name,
        passwordHash
    });

    const savedUser = user.save();

    res.status(201).json(savedUser);
});

module.exports = usersRouter;