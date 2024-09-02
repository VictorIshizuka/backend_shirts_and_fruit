var express = require("express");
var router = express.Router();

const Category = require("../models/category");

/* GET /api/categories */
router.get("/", async function (req, res, next) {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
