const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./config/db");
const port = 5000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to ecommerce api");
});

app.get("/db-test", async (req, res) => {
  try {
    const connection = await pool.connect();
    console.log("connection succesfull");
    const result = await connection.query("select NOW() as current_time");
    console.log(result.rows[0].current_time);
    connection.release();
    res.status(200).json({
      mesage: "database connnection succesfull",
      currentTime: result.rows[0].current_time,
    });
  } catch (err) {
    console.log(err.mesage);
    console.log(err);
    res
      .status(400)
      .json({ message: "database connection failed ", error: err.mesage });
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
