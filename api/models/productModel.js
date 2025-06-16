const pool = require("../config/db");

/**
 * @returns {Promise<Array>}
 */
async function getAllProducts() {
  const client = await pool.connect();
  try {
    const result = await client.query("select *from products");
    return result.rows;
  } finally {
    client.release();
  }
}

/**
 * @param {object} productId
 * @return {promise<Array>||null} product
 */
async function getProductById(productId) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      "select *from products where product_id=$1",
      [productId]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

/**
 * @param {object} product
 * @param {string} product.name
 * @param {string/text} product.description
 * @param {int} product.price
 * @param {int} product.stock_quantity
 * @param {string} product.image_url
 * @param {string} product.category
 * @returns {object} promise.obkjct
 */
async function addProduct(product) {
  const { name, description, price, stock_quantity, category, image_url } =
    product;
  const client = await pool.connect();
  try {
    const query =
      "insert into products(name,description,price,stock_quantity,category,image_url) values($1,$2,$3,$4,$5,$6) returning *  ";
    const values = [
      name,
      description,
      price,
      stock_quantity,
      category,
      image_url,
    ];
    const result = (await client).query(query, values);
    return result.rows[0];
  } finally {
    client.release();
  }
}

/**
 * @param {string} productId
 *  @param {object} product
 * @param {string} product.name
 * @param {string/text} product.description
 * @param {int} product.price
 * @param {int} product.stock_quantity
 * @param {string} product.image_url
 * @param {string} product.category
 * @returns {object} promise.object
 */

async function updateProduct(productId, product) {
  const { name, description, price, stock_quantity, category, image_url } =
    product;
  const client = await pool.connect();
  try {
    const updates = [];
    const values = [];
    const paramIndex = 1;
    if (name != undefined) {
      updates.push(`name=$${paramIndex++}`);
      values.push(name);
    }
    if (description != undefined) {
      updates.push(`description=$${paramIndex++}`);
      values.push(description);
    }
    if (price != undefined) {
      updates.push(`price=$${paramIndex++}`);
      values.push(price);
    }
    if (stock_quantity != undefined) {
      updates.push(`stock_quantity=$${paramIndex++}`);
      values.push(stock_quantity);
    }
    if (category != undefined) {
      updates.push(`category=$${paramIndex++}`);
      values.push(category);
    }
    if (image_url != undefined) {
      updates.push(`image_url=$${paramIndex++}`);
      values.push(image_url);
    }

    values.push(productId);
    const query = `update products set ${updates.join(
      ","
    )},updated_at=CURRENT_TIMESTAMP where product_id=${paramIndex} RETURNING * `;
    const result = (await client).query(query, values);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

/**
 * Deletes a product from the database.
 * @param {string} productId - The UUID of the product to delete.
 * @returns {Promise<Object|null>} A promise that resolves to the deleted product object or null if not found.
 */
async function deleteProduct(product_id) {
  const client = await pool.connect();
  try {
    const result = (await client).query(
      `delete from products where product_id=${1} returning *`,
      [product_id]
    );
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
