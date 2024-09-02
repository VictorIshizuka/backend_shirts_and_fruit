var express = require("express");
var router = express.Router();

const Page = require("../models/page.js");

/* GET /api/pages */
router.get("/", async function (req, res, next) {
  try {
    const pages = await Page.find({});
    res.status(200).json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
/* GET /api/pages/:id */
router.get("/:id", async function (req, res, next) {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
/* POST /api/pages */
router.post("/", async function (req, res, next) {
  try {
    req.body.slug = req.body.name.toLowerCase().trim().replace(/ /g, "-");

    await Page.create(req.body);

    res.status(201).json({ message: "Page created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
/* PUT /api/pages/:id */
router.put("/:id", async function (req, res, next) {
  try {
    req.body.slug = req.body.name.toLowerCase().trim().replace(/ /g, "-");
    await Page.findByIdAndUpdate(req.params.id, req.body);

    res.status(200).json({ message: "Page updated!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
/* DELETE /api/pages/:id */
router.delete("/:id", async function (req, res, next) {
  try {
    await Page.findByIdAndDelete(req.params.id, req.body);

    res.status(200).json({ message: "Page deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
