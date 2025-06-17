const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt_key = process.env.JWT_KEY;

function authorizationToken(req, res, next) {
  const header = req.header("Authorization");
  if (!header) {
    return res.status(400).json({ message: "header not found" });
  }
  const token = header.split(" ")[1];
  if (!token) {
    return res.status(400).json({ message: "token not found in header" });
  }
  try {
    const decode = jwt.decode(jwt_key, token);
    console.log(decode);
    req.user = decode.user;
    next();
  } catch (error) {
    console.log("token authenticatio failed: ", error);
    if (error.name == "TokenExpiredError") {
      res.status(401).json({ message: "token expired login again" });
    }
    res.status(401).json({ error: error.name });
  }
}
function authenticateIsAdmin(req, res, next) {
  if (!req.user.is_admin) {
    res.status(401).json({ message: "admin privileges not granted" });
  }
  next();
}
module.exports = {
  authenticateIsAdmin,
  authorizationToken,
};
