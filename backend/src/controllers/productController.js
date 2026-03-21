const Product = require("../models/Product");
const { cloudinary } = require("../utils/upload");

// Add product
exports.addProduct = async (req, res) => {
  try {

    let imageUrls = [];

    if (req.files && req.files.length > 0) {

      for (const file of req.files) {

        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products"
        });

        imageUrls.push(result.secure_url);

      }

    }

    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      images: imageUrls
    });

    res.status(201).json(product);

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: error.message });

  }
};


// Get all products
exports.getProducts = async (req, res) => {
  try {

    const products = await Product.find();

    res.json(products);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};


// Delete product
exports.deleteProduct = async (req, res) => {
  try {

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }
};

// Update product
exports.updateProduct = async (req, res) => {

  try {

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(product);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};