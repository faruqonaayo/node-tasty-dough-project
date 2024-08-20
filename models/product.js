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
    const savedProduct = await db.query(
      "INSERT INTO products (name, category,price,sales,imageurl) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [this.name, this.category, this.price, this.sales, this.imageurl]
    );
    return savedProduct;
  }
}

export default Product;
