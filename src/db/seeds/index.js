const path = require("path");
const dotenv = require("dotenv");

const dbConnect = require("../index.js");

const User = require("../../models/user.js");
const Page = require("../../models/page.js");
const Category = require("../../models/category.js");
const Product = require("../../models/product.js");

const users = require("./users.js");
const pages = require("./pages.js");
const categories = require("./categories.js");
const products = require("./products.js");

dotenv.config({ path: path.resolve(__dirname, "..", "..", "..", ".env") });

dbConnect();

const seedData = async () => {
  try {
    await Category.insertMany(categories);
    await Product.insertMany(products);
    await Page.insertMany(pages);
    await User.insertMany(users);
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
    await Product.deleteMany({});
    await Page.deleteMany({});
    await User.deleteMany({});
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
