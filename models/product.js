import { db } from "../util/dbConnect.js";

class Product {
  constructor(name, category, price, imageurl) {
    this.name = name;
    this.category = category;
    this.price = price;
    this.imageurl = imageurl;
  }

  async save() {
    try {
      const savedProduct = await db.query(
        "INSERT INTO products (name, category,price,imageurl) VALUES ($1,$2,$3,$4) RETURNING *",
        [this.name, this.category, this.price, this.imageurl]
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

  static async searchProduct(char) {
    try {
      const allProducts = await db.query(
        `SELECT * FROM products WHERE name LIKE '%${char}%' or category LIKE '%${char}%';`
      );
      return allProducts.rows;
    } catch (error) {
      // get back to handling errror

      console.log(error);
    }
  }
}

export default Product;
