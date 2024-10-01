var express = require("express");
var router = express.Router();
const { loggedIn } = require("../middleware/auth");

const Order = require("../models/order");

/* POST /api/order */
router.post("/", loggedIn, async function (req, res, next) {
  console.log(req.body);
  try {
    await Order.create(req.body);
    res.status(201).json({ message: "Order created!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* GET /api/orders/profile */
router.get("/profile", loggedIn, async function (req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: "desc",
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
