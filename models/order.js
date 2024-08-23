import { db } from "../util/dbConnect.js";

class Order {
  constructor(name, date, time, mobile) {
    this.name = name;
    this.date = date;
    this.time = time;
    this.mobile = mobile;
  }
  async createOrder(cartProds, sid) {
    try {
      if (cartProds.length === 0) {
        return null;
      }

      const createdOrderResponse = await db.query(
        "INSERT INTO orders (customer_name,pickup_date, pickup_time, mobile) VALUES($1,$2,$3,$4) RETURNING id",
        [this.name, this.date, this.time, this.mobile]
      );
        const createdOrder = createdOrderResponse.rows[0];
        
      let orderProducts = [];
      cartProds.forEach(async (prod) => {
        await db.query(
          "INSERT INTO order_products (order_id,product_id,doz_quantity) VALUES($1,$2,$3)",
          [createdOrder.id, prod.id, prod.doz_quantity]
        );
      });
      //  deleting the sessions cart product
      await db.query("DELETE FROM cart_products WHERE session_id = $1", [sid]);

      //   check if deleted and return the new orders product

      const userCartProducts = await db.query(
        "SELECT * FROM cart_products WHERE session_id = $1",
        [sid]
      );

      if (userCartProducts.rows.length !== 0) {
        return null;
      }

      //   getting the new order products
      const getOrderProducts = await db.query(
        "SELECT * FROM order_products WHERE order_id = $1",
        [createdOrder.id]
      );
      return getOrderProducts.rows;
    } catch (error) {
      // get back to handling errror
      console.log(error);
    }
  }
}

export default Order;
