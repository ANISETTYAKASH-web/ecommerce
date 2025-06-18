const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");

async function createOrder(req, res) {
  try {
    const user_id = req.user.id;
    const { items } = req.body;
    if (!items) {
      return res
        .status(400)
        .json({ message: "minimum one item should be selected" });
    }
    if (!items.product_id || !items.quantity || items.quantity <= 0) {
      return res.status(400).json({
        message:
          "Item should have product id and quantity also quantity should be > 0 ",
      });
    }
    const validateItems = [];
    const product = await productModel.getProductById(items.product_id);
    if (!product) {
      return res
        .status(404)
        .json({ message: `product with ${product_id} is not found` });
    }
    validateItems.push({
      user_id: user_id,
      quantity: quantity,
      product_id: product_id,
      price: product.price,
    });
    const result = await orderModel.createOrder(user_id, validateItems);
    return res.status(201).json(result);
  } catch (err) {
    console.error("error in ordercontroller:", err);
    return res.status(500).json({ message: "order creation failed" });
  }
}
