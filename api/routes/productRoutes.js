const express = require("express");
const Routes = express.Router();
const productController = require("../controllers/productController");
const auth = require("../middleware/authMiddleware");
const { body, param } = require("express-validator");

const productValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("product name should not be empty")
    .isLength({ min: 5, max: 100 }),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("description should not be empty")
    .isLength({ min: 10, max: 500 }),

  body("price")
    .notEmpty()
    .withMessage("price cannot be empty")
    .isFloat({ gt: 0 })
    .withMessage("price cannot be neg"),
  body("stock_quantity")
    .notEmpty()
    .withMessage("stock cannot be empty")
    .isInt({ min: 1 })
    .withMessage("stock should be min 1"),
  body("image_url")
    .optional()
    .isURL()
    .withMessage("please provide correct url format"),
  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty if provided")
    .isLength({ max: 50 })
    .withMessage("Category cannot exceed 50 characters"),
];

const productIdValidation = [
  param("product_id").isUUID().withMessage("product id should br in UUID"),
];

Routes.get("/", productValidator, productController.getProducts);
Routes.get("/:id", productIdValidation, productController.getProductById);

Routes.post(
  "/",
  auth.authorizationToken,
  productValidator,
  productController.createProduct
);
Routes.put(
  "/:id",
  auth.authorizationToken,
  productIdValidation,
  productController.updateProduct
);
Routes.delete(
  "/:id",
  auth.authorizationToken,
  auth.authenticateIsAdmin,
  productIdValidation,
  productController.deleteProduct
);

module.exports = Routes;
