import { db } from "../util/dbConnect.js";

class Cart {
  static async addToCart(id, sid) {
    try {
      const isProduct = await db.query("SELECT * FROM products WHERE id = $1", [
        id,
      ]);
      const isSession = await db.query(
        "SELECT * FROM sessions WHERE sid = $1",
        [sid]
      );

      if (isProduct.rows.length === 1 && isSession.rows.length === 1) {
        const cartProduct = await db.query(
          "INSERT INTO cart_products (session_id, product_id, doz_quantity) VALUES($1,$2,$3) RETURNING *",
          [sid, id, 1]
        );
        const productPrice = await db.query(
          "SELECT price FROM products WHERE id = $1",
          [id]
        );
        const response = cartProduct.rows[0];
        return {
          ...response,
          price: Number(productPrice.rows[0].price.replace("$", "")),
        };
      }
      return null;
    } catch (error) {
      // get back to handling errror

      console.log(error);
    }
  }

  static async getUserCartProducts(sid) {
    try {
      const userCartProducts = await db.query(
        `SELECT cart_products.id, cart_products.session_id, cart_products.product_id, cart_products.doz_quantity, 
            products.name, products.price, (products.price::money::numeric::float8 ) as doz_price
            FROM cart_products
            INNER JOIN products
            ON cart_products.product_id = products.id
            WHERE session_id = $1`,
        [sid]
      );
      return userCartProducts.rows;
    } catch (error) {
      // get back to handling errror

      console.log(error);
    }
  }

  static async getOneCartProduct(id) {
    try {
      const cartProduct = await db.query(
        "SELECT * FROM cart_products WHERE id =$1",
        [id]
      );
      return cartProduct.rows[0];
    } catch (error) {
      // get back to handling errror
      console.log(error);
    }
  }

  static async updateRecord(id, field, value) {
    try {
      const updatedRecord = db.query(
        `UPDATE cart_products SET ${field} = ${value} WHERE id =${id} RETURNING *`
      );
      if (updatedRecord) {
        return true;
      }
      return null;
    } catch (error) {
      // get back to handling errror

      console.log(error);
    }
  }

  static async removeOneCartProduct(sid, id) {
    try {
      const deletedRecord = db.query(
        "DELETE FROM cart_products WHERE id = $1 AND session_id =$2",
        [id, sid]
      );
      if (deletedRecord) {
        return true;
      }
      return null;
    } catch (error) {
      // get back to handling errror

      console.log(error);
    }
  }
}

export default Cart;
