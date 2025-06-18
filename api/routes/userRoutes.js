const express = require("express");
const routes = express.Router();
const usersController = require("../controllers/usersController");
const { body } = require("express-validator");

const registerValidationRules = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("username should not be empty")
    .isLength({ min: 3 })
    .withMessage("username should be minimum 3 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("email should not be empty")
    .isEmail()
    .withMessage("please enter email in accepted format")
    .normalizeEmail(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("password should not be empty")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[/d])(?=.*[!@#$%&*])([a-zA-Z/d!@#$%&*]){6,}$/
    )
    .withMessage(
      "password should contain atleast one uppercase ,lowercase, number, special character,min len:6"
    ),
  body("first_name")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("should not be empty if provided"),

  body("last_name")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("should not be empty if provided"),
];

const loginValidationRules = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("provide a email")
    .isEmail()
    .normalizeEmail(),
  body("password").notEmpty().withMessage("password cannot be empty"),
];

routes.post("/login", loginValidationRules, usersController.loginUser);
routes.post(
  "/register",
  registerValidationRules,
  usersController.createNewUser
);

module.exports = routes;
