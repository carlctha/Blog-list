const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');
const blogsRouter = require("./controllers/blogs");
const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");

mongoose.connect(config.mongoUrl).then(() => {
    logger.info("connected to database");
}).catch((error) => {
    logger.error("Could not connect to databse", error.message)
})

app.use(cors());
app.use(express.json());
app.use(middleware.httpLogger);

app.use("/api/blogs", blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
