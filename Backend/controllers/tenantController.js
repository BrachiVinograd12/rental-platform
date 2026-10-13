
const Tenant = require('../models/Tenant');

const createTenant = async (req, res) => {
  try {
    const { name, slug, description, contactEmail, contactPhone } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        message: 'Business name and slug are required',
      });
    }

    const normalizedSlug = slug.trim().toLowerCase();

    const existingTenant = await Tenant.findOne({
      slug: normalizedSlug,
    });

    if (existingTenant) {
      return res.status(409).json({
        message: 'This business URL is already taken',
      });
    }

    const tenant = await Tenant.create({
      name: name.trim(),
      slug: normalizedSlug,
      description,
      contactEmail,
      contactPhone,
    });

    return res.status(201).json({
      message: 'Business created successfully',
      tenant,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'This business URL is already taken',
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Invalid business data',
      });
    }

    console.error('Create tenant error:', error.message);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const getTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find({ isActive: true })
      .select('name slug description logoUrl primaryColor');

    return res.status(200).json({ tenants });
  } catch (error) {
    console.error('Get tenants error:', error.message);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

module.exports = {
  createTenant,
  getTenants,
};
