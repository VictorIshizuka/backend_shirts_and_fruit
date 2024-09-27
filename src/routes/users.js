var express = require("express");
const jwt = require("jsonwebtoken");

var router = express.Router();

const User = require("../models/user");
const { loggedIn, admin } = require("../middleware/auth.js");

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
    res.status(200).json({
      _id: foundUser._id,
      username: foundUser.username,
      isAdmin: foundUser.isAdmin,
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});
/* POST /api/users/register */
router.post("/register", async function (req, res, next) {
  try {
    const foundUser = await User.findOne({ email: req.body.email });

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
router.post("/logout", loggedIn, async function (req, res, next) {
  res.clearCookie("jwt");
  res.status(200).json({ message: "You have successfully logged out" });
});

// GET /api/users
router.get("/", loggedIn, admin, async function (req, res, next) {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(401).json(error.message);
  }
});

//GET /api/users/:id
router.get("/:id", loggedIn, admin, async function (req, res, next) {
  try {
    const id = req.params.id;
    const foundUser = await User.findById(id);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(foundUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/users/:id
router.put("/:id", loggedIn, admin, async function (req, res, next) {
  try {
    const id = req.params.id;
    await User.findByIdAndUpdate(id);
    res.status(200).json({ message: "User updated!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// DELETE /api/users/:id
router.delete("/:id", loggedIn, admin, async function (req, res, next) {
  try {
    const id = req.params.id;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
