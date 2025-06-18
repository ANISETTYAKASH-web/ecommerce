const ordercontroller = require("../controllers/orderController");
const auth = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

router.post("/", auth.authorizationToken, ordercontroller.createOrder);
router.get("/", auth.authorizationToken, ordercontroller.getOrders);
router.get(
  "/:order_id",
  auth.authorizationToken,
  ordercontroller.getOrdersById
);

module.exports = router;
