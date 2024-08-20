import Product from "../models/product.js";

export async function getBakery(req, res, next) {
  try {
    const allProducts = await Product.getAllProducts();
    // console.log(allProducts);
    res.status(200).render("general-views/bakery", { allProducts });
  } catch (error) {
    // handle error later
    next(error);
  }
}
