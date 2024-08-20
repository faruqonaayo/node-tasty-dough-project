import db from "../util/dbConnect.js";

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
}

export default Product;
