var express = require("express");
var router = express.Router();

const Product = require("../models/product.js");

/* GET /api/products */
router.get("/", async function (req, res, next) {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
/* GET /api/products/:id */
router.get("/:id", async function (req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
/* POST /api/products */
router.post("/", async function (req, res, next) {
  try {
    req.body.slug = req.body.name.toLowerCase().trim().replace(/ /g, "-");
    req.body.image = req.body.image || "noimage.jpg";
    await Product.create(req.body);

    res.status(201).json({ message: "Product created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
/* PUT /api/products/:id */
router.put("/:id", async function (req, res, next) {
  try {
    req.body.slug = req.body.name.toLowerCase().trim().replace(/ /g, "-");
    req.body.image = req.body.image || "noimage.jpg";
    await Product.findByIdAndUpdate(req.params.id, req.body);

    res.status(200).json({ message: "Product updated!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
/* DELETE /api/products/:id */
router.delete("/:id", async function (req, res, next) {
  try {
    await Product.findByIdAndDelete(req.params.id, req.body);

    res.status(200).json({ message: "Product deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
