const express = require("express");
const Routes = express.Router();
const productController = require("../controllers/productController");

Routes.get("/", productController.getProducts);
Routes.get("/:id", productController.getProductById);
Routes.post("/", productController.createProduct);
Routes.put("/:id", productController.updateProduct);
Routes.delete("/:id", productController.deleteProduct);

module.exports = Routes;
