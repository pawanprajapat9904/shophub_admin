const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

console.log("Cloudinary:", process.env.CLOUD_NAME, process.env.CLOUD_KEY);

const storage = multer.diskStorage({});

const upload = multer({ storage });

module.exports = { cloudinary, upload };