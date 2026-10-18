
const Tenant = require("../models/tenantModel");

async function createTenant(data) {
  return Tenant.create({
    name: data.name,
    slug: data.slug,
    description: data.description,
    logoUrl: data.logoUrl,
    primaryColor: data.primaryColor,
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone,
  });
}

async function getTenants() {
  return Tenant.find().sort({ createdAt: -1 });
}

async function getTenantById(id) {
  return Tenant.findById(id);
}

async function updateTenant(id, data) {
  const allowedFields = [
    "name",
    "slug",
    "description",
    "logoUrl",
    "primaryColor",
    "contactEmail",
    "contactPhone",
    "isActive",
  ];

  const updates = {};
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  }

  return Tenant.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
}

async function deleteTenant(id) {
  const tenant = await Tenant.findById(id);

  if (!tenant) return null;

  // Do not delete products automatically.
  // Product deletion policy should be decided separately.
  await tenant.deleteOne();

  return tenant;
}

module.exports = {
  createTenant,
  getTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
};
