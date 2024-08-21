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

export async function getAddToCart(req, res, next) {
  try {
    const prodId = req.params.id;
    const product = await Product.getOneProduct(prodId);
    // console.log(product);
    if (!product) {
      return next();
    }
    return res.status(200).render("general-views/cart-form", {
      productId: product.id,
      productName: product.name,
      error: null,
    });
  } catch (error) {
    // handle error later
    next(error);
  }
}
