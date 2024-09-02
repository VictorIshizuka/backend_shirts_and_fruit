var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const dbConnect = require("./src/db/index.js");

require("dotenv").config();

dbConnect();

const categoriesRouter = require("./src/routes/categories.js");
const productsRouter = require("./src/routes/products.js");
const pagesRouter = require("./src/routes/pages.js");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/categories", categoriesRouter);
app.use("/api/products", productsRouter);
app.use("/api/pages", pagesRouter);

module.exports = app;
