const express = require("express");
const routes = express.Router();
const usersController = require("../controllers/usersController");

routes.post("/login", usersController.loginUser);
routes.post("/register", usersController.createNewUser);

module.exports = routes;
