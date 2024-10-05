var express = require("express");
var router = express.Router();

const Rating = require("../models/rating");
const Product = require("../models/product");
const { loggedIn } = require("../middleware/auth");

/* POST /api/ratings */
router.post("/", loggedIn, async function (req, res, next) {
  const { value, product, user } = req.body;
  try {
    const existingRating = await Rating.findOne({ user, product });

    if (existingRating) {
      res.status(400).json({ message: " You have already rated this product" });
      return;
    }

    const currentProduct = await Product.findById(product);
    const rating = currentProduct.rating + value;
    const totalRatings = await Rating.countDocuments({ product });
    const newRating = Math.round((rating / (totalRatings + 1)) * 2) / 2;

    await Product.findByIdAndUpdate(product, {
      rating: newRating,
    });

    await Rating.create(req.body);
    res.status(201).json({ message: "Rating created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//GET /api/rating/user/:productId
router.get("/user/:productId", loggedIn, async function (req, res, next) {
  try {
    const rating = await Rating.findOne({
      user: req.user._id,
      product: req.params.productId,
    });
    const ratingValue = rating ? rating.value : 0;
    res.status(200).json(ratingValue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
