const express = require("express");
const Routes = express.Router();
const productController = require("../controllers/productController");
const auth = require("../middleware/authMiddleware");

Routes.get("/", productController.getProducts);
Routes.get("/:id", productController.getProductById);

Routes.post("/", auth.authorizationToken, productController.createProduct);
Routes.put("/:id", auth.authorizationToken, productController.updateProduct);
Routes.delete(
  "/:id",

  auth.authorizationToken,
  auth.authenticateIsAdmin,
  productController.deleteProduct
);

module.exports = Routes;
