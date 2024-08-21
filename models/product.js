import { db } from "../util/dbConnect.js";

class Product {
  constructor(name, category, price, sales, imageurl) {
    this.name = name;
    this.category = category;
    this.price = price;
    this.sales = sales;
    this.imageurl = imageurl;
  }

  async save() {
    try {
      const savedProduct = await db.query(
        "INSERT INTO products (name, category,price,sales,imageurl) VALUES ($1,$2,$3,$4,$5) RETURNING *",
        [this.name, this.category, this.price, this.sales, this.imageurl]
      );
      return savedProduct.rows[0];
    } catch (error) {
      // get back to handling errror
      console.log(error);
    }
  }

  static async getAllProducts() {
    try {
      const allProducts = await db.query("SELECT * FROM products");
      return allProducts.rows;
    } catch (error) {
      // get back to handling errror

      console.log(error);
    }
  }

  static async getOneProduct(id) {
    try {
      const product = await db.query("SELECT * FROM products WHERE id = $1", [
        id,
      ]);
      return product.rows[0];
    } catch (error) {
      // get back to handling errror

      console.log(error);
    }
  }

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
          "INSERT INTO cart_products (session_id, product_id, doz_quantity, paid) VALUES($1,$2,$3,$4) RETURNING *",
          [sid, id, 1, false]
        );
        return cartProduct.rows[0];
      }
      return null;
    } catch (error) {
      // get back to handling errror

      console.log(error);
    }
  }
}

export default Product;
