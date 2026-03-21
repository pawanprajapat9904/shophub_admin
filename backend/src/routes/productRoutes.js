const express = require("express");

const router = express.Router();

const {
  addProduct,
  getProducts,
  deleteProduct
} = require("../controllers/productController");

const { upload } = require("../utils/upload");

const adminAuth = require("../middleware/adminAuthMiddleware");
const { updateProduct } = require("../controllers/productController");

router.post("/", adminAuth, upload.array("images", 5), addProduct);

router.get("/", getProducts);

router.delete("/:id", adminAuth, deleteProduct);
router.put("/:id", adminAuth, updateProduct);

module.exports = router;