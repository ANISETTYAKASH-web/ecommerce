const pool = require("../config/db");

/**
 * @param {string} user_id-uuid
 * @param {Array<object>} items
 * 
 @returns {Promise} neworder
 */
async function createOrder(user_id, items) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    //update order table
    const orderQuery =
      "insert into orders(user_id,total_amount) values($1,$2) returning *";
    let total_amount = 0;
    for (const item of items) {
      total_amount += item.quantity * item.price;
    }
    const orderResult = await client.query(
      orderQuery,
      [user_id],
      [total_amount]
    );

    const newOrder = orderResult.rows[0];

    //update order_items table
    const oderItemsToInsert = [];
    for (const item of items) {
      const { product_id, price, quantity } = item;
      const productCheckQuery =
        "select stock_quantity from products where product_id=$1";
      const productCheckResult = await client.query(productCheckQuery, [
        product_id,
      ]);
      if (productCheckResult.length == 0) {
        throw new Error(`product with ${product_id} does not exist`);
      }
      if (productCheckResult.rows[0].stock_quantity < quantity) {
        throw new Error(
          `product with ${product_id} have only this quantity ${stock_quantity} but u placed ${quantity}`
        );
      }
      //up until above we just made sure that product and enough quantity of that product exists now we update order_items table
      const orderItemsQuery =
        "insert into order_items(order_id,product_id,quantity,price_at_purchase) values($1,$2,$3,$4) returning *";

      const orderItemsResult = await client.query(
        orderItemsQuery,
        [newOrder.order_id],
        [product_id],
        [quantity],
        [price]
      );
      oderItemsToInsert.push(orderItemsResult.rows[0]);
      //update products table

      const prodcutQuantityUpdateQuery = `update from products set stock_quantity=${
        stock_quantity - quantity
      } where product_id={1}`;
      const productUpdateResult = await client.query(
        prodcutQuantityUpdateQuery,
        [product_id]
      );
    }
    await client.query("COMMIT");
    return { newOrder, orderItemsResult };
  } catch (err) {
    await client.query("ROLLBACK");
    console.log("error:", err);
    throw err;
  } finally {
    client.release();
  }
}
