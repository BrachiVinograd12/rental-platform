
const mongoose = require("mongoose");
const productService = require("../services/productService");

function validId(id) {
  return mongoose.isValidObjectId(id);
}

function handleError(res, error) {
  if (error.status) {
    return res.status(error.status).json({
      message: error.message,
    });
  }

  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({
      message: error.message,
    });
  }

  console.error(error);
  return res.status(500).json({
    message: "Internal server error",
  });
}

async function createProduct(req, res) {
  try {
    const {
      tenantId,
      name,
      pricePerDay,
      totalQuantity,
    } = req.body;

    if (!validId(tenantId)) {
      return res.status(400).json({
        message: "A valid tenantId is required",
      });
    }

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Product name is required",
      });
    }

    if (
      pricePerDay === undefined ||
      !Number.isFinite(Number(pricePerDay)) ||
      Number(pricePerDay) < 0
    ) {
      return res.status(400).json({
        message: "A valid pricePerDay is required",
      });
    }

    if (
      !Number.isInteger(Number(totalQuantity)) ||
      Number(totalQuantity) < 1
    ) {
      return res.status(400).json({
        message: "totalQuantity must be a positive integer",
      });
    }

    const product = await productService.createProduct(req.body);

    return res.status(201).json({ product });
  } catch (error) {
    return handleError(res, error);
  }
}

async function getProductsByTenant(req, res) {
  try {
    const { tenantId } = req.params;

    if (!validId(tenantId)) {
      return res.status(400).json({ message: "Invalid tenant ID" });
    }

    const products =
      await productService.getProductsByTenant(tenantId);

    return res.json({ products });
  } catch (error) {
    return handleError(res, error);
  }
}

async function getProductById(req, res) {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product =
      await productService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ product });
  } catch (error) {
    return handleError(res, error);
  }
}

async function updateProduct(req, res) {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await productService.updateProduct(
      req.params.id,
      req.body
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ product });
  } catch (error) {
    return handleError(res, error);
  }
}

async function deleteProduct(req, res) {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product =
      await productService.deleteProduct(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({
      message: "Product deleted",
      product,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

module.exports = {
  createProduct,
  getProductsByTenant,
  getProductById,
  updateProduct,
  deleteProduct,
};
