var express = require("express");
var router = express.Router();
const fs = require("fs");
const multer = require("multer");
const Product = require("../models/product.js");
const { loggedIn, admin } = require("../middleware/auth.js");

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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      "/Estudo/frontend/shirts_and_fruit_full/frontend/frontend_shirts_and_fruit/public/images"
    );
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

/* POST /api/products */
router.post(
  "/",
  upload.single("image"),
  loggedIn,
  admin,
  async function (req, res, next) {
    try {
      req.body.slug = req.body.name.toLowerCase().trim().replace(/ /g, "-");
      req.body.image = req.file ? req.file.filename : "noimage.jpg";

      const newProduct = await Product.create(req.body);

      const folderPath = `../../frontend/frontend_shirts_and_fruit/public/galley/${newProduct._id}`;

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      res.status(201).json({ message: "Product created" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/* PUT /api/products/:id */
router.put(
  "/:id",
  upload.single("image"),
  loggedIn,
  admin,
  async function (req, res, next) {
    try {
      req.body.slug = req.body.name.toLowerCase().trim().replace(/ /g, "-");
      req.body.image = req.file ? req.file.filename : req.body.productImage;

      await Product.findByIdAndUpdate(req.params.id, req.body);

      const oldProductImage = req.file ? req.body.productImage : null;

      if (oldProductImage && oldProductImage !== "noimage.jpg") {
        const imagePath = `../../frontend/frontend_shirts_and_fruit/public/images/${oldProductImage}`;
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        } else {
          console.log("File not found");
        }
      }

      res.status(200).json({ message: "Product updated!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/* POST /api/products/:id */
router.post("/:id", loggedIn, admin, async function (req, res, next) {
  const product = await Product.findById(req.params.id);
  const image = product.image;
  try {
    await Product.findByIdAndDelete(req.params.id);
    const folderPath = `../../frontend/frontend_shirts_and_fruit/public/gallery/${req.params.id}`;
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true });
    } else {
      console.log("Folder not found");
    }
    if (image !== "noimage.jpg") {
      const imagePath = `../../frontend/frontend_shirts_and_fruit/public/images/${image}`;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath, err => {
          if (err) console.log(err);
        });
      } else {
        console.log("File not found");
      }
    }

    res.status(200).json({ message: "Product deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* GET /api/products/categories/:slug */
router.get("/categories/:slug", async function (req, res, next) {
  const slug = req.params.slug;
  try {
    const products =
      slug === "all"
        ? await Product.find({})
        : await Product.find({ category: slug });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//POST /api/products/multiupload/:id
router.post(
  "/multiupload/:id",
  upload.array("images"),
  loggedIn,
  admin,
  async function (req, res) {
    const id = req.params.id;
    const folderPath = `../../frontend/frontend_shirts_and_fruit/public/gallery/${id}`;
    console.log(id);
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(
          null,
          "/Estudo/frontend/shirts_and_fruit_full/frontend/frontend_shirts_and_fruit/public/gallery/" +
            id
        );
      },
      filename: function (req, file, cb) {
        console.log({ file: file });
        cb(null, Date.now() + "-" + file.originalname);
      },
    });
    const upload = multer(storage);

    upload.array("images")(req, res, function (error) {
      if (error) {
        console.log({ error });
        return res.status(500).json({ message: error.message });
      }
      res.status(200).json({ message: "Files uploaded successfully" });
    });
  }
);

//GET /api/products/images/:id
router.get("/images/:id", loggedIn, admin, async function (req, res) {
  const id = req.params.id;
  const folderPath = `../../frontend/frontend_shirts_and_fruit/public/gallery/${id}`;
  if (!fs.existsSync(folderPath)) {
    return res.status(404).json({ message: "Folder not found" });
  }
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Error reading folder" });
    }
    res.json(files);
  });
});

//POST /api/products/deleteimage
router.post("/deleteimage", loggedIn, admin, function (req, res) {
  const { id, image } = req.body;
  const imagePath = `../../frontend/frontend_shirts_and_fruit/public/gallery/${id}/${image}`;
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
    return res.status(200).json({ message: "Image deleted successfully" });
  } else {
    res.status(404).json({ message: "Image not found" });
  }
});

module.exports = router;
