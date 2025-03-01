import { sql } from "../config/db.js";

export const getProducts = async (req, res) => {
  try {
    const products = await sql`SELECT * FROM products
        ORDER BY created_at  DESC`;
    console.log("products:", products);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error while fetching products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createProduct = async (req, res) => {
  const { image, name, price } = req.body;
  if (!name || !image || !price) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }
  try {
    const newProduct =
      await sql`INSERT INTO products (name,image,price) VALUES (${name},${image},${price})`;
    console.log("newProduct:", newProduct);
    return res.status(201).json({ success: true, data: newProduct[0] });
  } catch (error) {
    console.error("Error while creating product:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await sql`SELECT * FROM products WHERE id=${id}`;
    console.log("product:", product);
    if (product.count === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    console.error("Error while fetching product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, image, price } = req.body;
  try {
    const updatedProduct =
      await sql`UPDATE products SET name=${name},image=${image},price=${price} WHERE id=${id} RETURNING *`;
    console.log("updatedProduct:", updatedProduct);
    if (updatedProduct.count === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: updatedProduct[0] });
  } catch (error) {
    console.error("Error while updating product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct =
      await sql` DELETE FROM products WHERE id=${id} RETURNING *`;
    if (deletedProduct.count === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    console.log("deletedProduct:", deletedProduct);
    res.status(200).json({ success: true, data: deletedProduct[0] });
  } catch (error) {
    console.error("Error while deleting product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
