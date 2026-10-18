
const Product = require("../models/productModel");
const Tenant = require("../models/tenantModel");

async function createProduct(data) {
  const tenant = await Tenant.findById(data.tenantId);

  if (!tenant) {
    const error = new Error("Tenant not found");
    error.status = 404;
    throw error;
  }

  return Product.create({
    tenantId: data.tenantId,
    categoryId: data.categoryId || null,
    name: data.name,
    description: data.description,
    images: data.images,
    pricePerDay: data.pricePerDay,
    currency: data.currency,
    totalQuantity: data.totalQuantity,
  });
}

async function getProductsByTenant(tenantId) {
  return Product.find({ tenantId }).sort({ createdAt: -1 });
}

async function getProductById(id) {
  return Product.findById(id);
}

async function updateProduct(id, data) {
  const allowedFields = [
    "categoryId",
    "name",
    "description",
    "images",
    "pricePerDay",
    "currency",
    "totalQuantity",
    "isActive",
  ];

  const updates = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  }

  return Product.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
}

async function deleteProduct(id) {
  return Product.findByIdAndDelete(id);
}

module.exports = {
  createProduct,
  getProductsByTenant,
  getProductById,
  updateProduct,
  deleteProduct,
};
