require("dotenv").config();

const mongoUrl = process.env.URL;

const PORT = process.env.PORT;

module.exports = {
    mongoUrl, PORT
}
