const productModel = require("../models/productModel");
const { validationResult } = require("express-validator");
async function getProducts(req, res) {
  try {
    const result = await productModel.getAllProducts();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

async function getProductById(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const result = await productModel.getProductById(id);
    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

async function createProduct(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const productData = req.body;

    const newProduct = await productModel.addProduct(productData);
    res.status(201).json(newProduct); // 201 Created status
  } catch (error) {
    console.error("Error creating product:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

async function updateProduct(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const productData = req.body; // Updated product data

    // Basic validation (optional, depends on desired behavior)
    // if (Object.keys(productData).length === 0) {
    //   return res.status(400).json({ message: 'No update data provided' });
    // }
    console.log(`Debug: Received ID in controller: ${id}`);
    console.log(`Debug: Type of ID in controller: ${typeof id}`);
    const updatedProduct = await productModel.updateProduct(id, productData);

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ message: "Product not found or no changes made" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

/**
 * Delete a product.
 * DELETE /api/products/:id
 */
async function deleteProduct(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const deletedProduct = await productModel.deleteProduct(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(200)
      .json({ message: "Product deleted successfully", deletedProduct });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

module.exports = {
  getProductById,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
