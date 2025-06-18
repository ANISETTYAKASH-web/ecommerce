const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");

async function createOrder(req, res) {
  try {
    const user_id = req.user.user_id;
    console.log("user id printing:", user_id);
    const { items } = req.body;
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "minimum one item should be selected" });
    }
    const validateItems = [];
    for (const item of items) {
      if (!item.product_id || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          message:
            "Item should have product id and quantity also quantity should be > 0 ",
        });
      }

      const product = await productModel.getProductById(item.product_id);
      if (!product) {
        return res
          .status(404)
          .json({ message: `product with ${item.product_id} is not found` });
      }
      validateItems.push({
        quantity: item.quantity,
        product_id: item.product_id,
        price: product.price,
      });
    }
    const result = await orderModel.createOrder(user_id, validateItems);
    res
      .status(201)
      .json({ message: "order created succesfully", order: result });
  } catch (err) {
    console.error("error in ordercontroller:", err);
    res
      .status(500)
      .json({ message: "order creation failed", error: err.message });
  }
}

async function getOrders(req, res) {
  try {
    const user_id = req.user.user_id;
    const result = await orderModel.getOrdersByUser(user_id);
    res.status(200).json(result);
  } catch (err) {
    console.error("error in ordercontroller:", err);
    res.status(500).json({
      message: "getting all orders of user failed",
      error: err.message,
    });
  }
}

async function getOrdersById(req, res) {
  try {
    const user_id = req.user.user_id;
    const { order_id } = req.params;
    const result = await orderModel.getOrderbyIdAndUser(user_id, order_id);
    console.log(result);
    if (!result) {
      return res.status(404).json({
        message: "Order not found or you do not have permission to view it.",
      });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("error in ordercontroller:", err);
    res
      .status(500)
      .json({ message: "getting order details failed", error: err.message });
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrdersById,
};
