const userModel = require("../models/userModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const jstKey = process.env.JWT_KEY;
if (!jstKey) {
  console.log("jswebtoken key not found");
  process.exit(1);
}
async function createNewUser(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password, first_name, last_name } = req.body;

    // if (!username || !email || !password) {
    //   return res.status(400).json({ message: "every detail is not found" });
    // } NOT REQUIRED AS WE ARE USING EXPRESS VALIDATOR
    const userAlreadyExists = await userModel.findUserByEmail(email);
    if (userAlreadyExists) {
      return res
        .status(409)
        .json({ message: "account with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const newUser = await userModel.createUser({
      username,
      email,
      password_hash,
      first_name,
      last_name,
      is_admin: false,
    });
    console.log("new user", newUser);
    console.log("username:", newUser.username);
    const token = jwt.sign(
      {
        user: {
          user_id: newUser.user_id,
          email: newUser.email,
          is_admin: newUser.is_admin,
        },
      },
      jstKey,
      { expiresIn: "1h" }
    );
    return res.status(201).json({
      message: "user created successfully",
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        is_admin: newUser.is_admin,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: "user creation failed(controller)",
      Error: error.message,
    });
  }
}

async function loginUser(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password } = req.body;
    // if (!email || !password) {
    //   return res.status(400).json({ message: "every detail is not found" });
    // }NOT REQUIRED AS WE ARE USING EXPRESS VALIDATOR
    const findUserExists = await userModel.findUserByEmail(email);
    if (!findUserExists) {
      return res
        .status(409)
        .json({ message: "account with this email does not exists" });
    }
    const passwordCheck = await bcrypt.compare(
      password,
      findUserExists.password_hash
    );
    if (!passwordCheck) {
      return res.status(409).json({ message: "invalid credentials" });
    }
    const token = jwt.sign(
      {
        findUserExists: {
          user_id: findUserExists.user_id,
          email: findUserExists.email,
          is_admin: findUserExists.is_admin,
        },
      },
      jstKey,
      { expiresIn: "1h" }
    );
    console.log(findUserExists);
    return res.status(201).json({
      message: "login succesfull",
      user: {
        user_id: findUserExists.user_id,
        username: findUserExists.username,
        email: findUserExists.email,
        first_name: findUserExists.first_name,
        last_name: findUserExists.last_name,
        is_admin: findUserExists.is_admin,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ msg: "controller error", error: error.message });
  }
}

module.exports = {
  createNewUser,
  loginUser,
};
