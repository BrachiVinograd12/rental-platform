
const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProductsByTenant,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.post("/", createProduct);
router.get("/tenant/:tenantId", getProductsByTenant);
router.get("/:id", getProductById);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
