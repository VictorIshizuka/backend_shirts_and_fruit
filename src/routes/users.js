var express = require("express");
const jwt = require("jsonwebtoken");

var router = express.Router();

const User = require("../models/user");

/* POST /api/users/login */
router.post("/login", async function (req, res, next) {
  const foundUser = await User.findOne({ email: req.body.email });
  if (foundUser && (await foundUser.matchPassword(req.body.password))) {
    const token = jwt.sign({ _id: foundUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 8640000,
    });
    res.status(200).json({ _id: foundUser._id, name: foundUser.name });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});
/* POST /api/users/register */
router.post("/register", async function (req, res, next) {
  try {
    const foundUser = await User.findOne({ email: req.body.email });
    console.log(foundUser);
    if (foundUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    await User.create(req.body);
    res.status(201).json({ message: "You have successfully registered" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* POST /api/users/logout */
router.post("/logout", async function (req, res, next) {
  res.clearCookie("jwt");
  res.status(200).json({ message: "You have successfully logged out" });
});

module.exports = router;
