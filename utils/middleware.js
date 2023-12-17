const logger = require("./logger");

const httpLogger = (req, res, next) => {
    logger.info("Method", req.method);
    logger.info("Path: ", req.path);
    logger.info("Body: ", req.body);

    next();
};
// for undefined routes
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "unknown endpoint" });
};
// global error handler
const errorHandler = (error, req, res, next) => {
    logger.error(error.message);

    if (error.name === "CastError") {
        return res.status(400).send({ error: "malfromatted id" });
    } else if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.message });
    };

    next(error);
};

module.exports = {
    errorHandler, unknownEndpoint, httpLogger
};