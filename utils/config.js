require("dotenv").config();

const mongoUrl = process.env.URL;
const PORT = 3003;

module.exports = {
    mongoUrl, PORT
}