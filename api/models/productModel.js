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
  const client = pool.connect();
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
  const client = pool.connect();
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
