const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;

app.get("/", (req, res) => {
  res.send("Welcome to ecommerce api");
});

app.get("/api/check", (req, res) => {
  res.status(200).json({ message: "basic get method working properly" });
});
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
