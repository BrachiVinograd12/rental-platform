
const mongoose = require("mongoose");
const tenantService = require("../services/tenantService");

function validId(id) {
  return mongoose.isValidObjectId(id);
}

function handleError(res, error) {
  if (error.code === 11000) {
    return res.status(409).json({
      message: "This slug is already in use",
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

async function createTenant(req, res) {
  try {
    if (
      typeof req.body.name !== "string" ||
      !req.body.name.trim() ||
      typeof req.body.slug !== "string" ||
      !req.body.slug.trim()
    ) {
      return res.status(400).json({
        message: "Name and slug are required",
      });
    }

    const tenant = await tenantService.createTenant(req.body);
    return res.status(201).json({ tenant });
  } catch (error) {
    return handleError(res, error);
  }
}

async function getTenants(req, res) {
  try {
    const tenants = await tenantService.getTenants();
    return res.json({ tenants });
  } catch (error) {
    return handleError(res, error);
  }
}

async function getTenantById(req, res) {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid tenant ID" });
    }

    const tenant = await tenantService.getTenantById(req.params.id);

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    return res.json({ tenant });
  } catch (error) {
    return handleError(res, error);
  }
}

async function updateTenant(req, res) {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid tenant ID" });
    }

    const tenant = await tenantService.updateTenant(
      req.params.id,
      req.body
    );

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    return res.json({ tenant });
  } catch (error) {
    return handleError(res, error);
  }
}

async function deleteTenant(req, res) {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({ message: "Invalid tenant ID" });
    }

    const tenant = await tenantService.deleteTenant(req.params.id);

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    return res.json({
      message: "Tenant deleted",
      tenant,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

module.exports = {
  createTenant,
  getTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
};
