const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");

const connectToDatabase = async () => {
    try {
      await mongoose.connect(config.mongoUrl);
      logger.info("Connected to the database");
    } catch (error) {
      logger.error("Could not connect to the database", error.message);
    };
  };

connectToDatabase()

app.use(cors());
app.use(express.json());
app.use(middleware.httpLogger);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;