const path = require("path");
const dotenv = require("dotenv");

const dbConnect = require("../index.js");

const User = require("../../models/user.js");
const Page = require("../../models/page.js");
const Category = require("../../models/category.js");
const Product = require("../../models/product.js");
const Order = require("../../models/order.js");
const Rating = require("../../models/rating.js");

const users = require("./users.js");
const pages = require("./pages.js");
const categories = require("./categories.js");
const products = require("./products.js");

dotenv.config({ path: path.resolve(__dirname, "..", "..", "..", ".env") });
const fs = require("fs");

dbConnect();

const seedData = async () => {
  try {
    await Category.insertMany(categories);
    await Page.insertMany(pages);
    await User.insertMany(users);
    const insertProduct = await Product.insertMany(products);
    insertProduct.forEach(product => {
      const id = product._id.toString();
      const folderPath = `../../frontend/frontend_shirts_and_fruit/public/gallery/${id}`;
      fs.mkdirSync(folderPath, { recursive: true });
    });
    console.log("Data imported!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
const destroyData = async () => {
  try {
    await Category.deleteMany({});
    await Page.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    await Rating.deleteMany({});

    const products = await Product.find({});
    products.forEach(product => {
      const id = product._id.toString();
      const folderPath = `../../frontend/frontend_shirts_and_fruit/public/gallery/${id}`;

      if (fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true });
      }
    });
    console.log("Data destroyed!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  seedData();
}
