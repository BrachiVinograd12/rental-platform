const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ['platform_admin', 'business_admin', 'staff', 'customer'],
      required: true,
      default: 'customer',
    },

    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { role: 'platform_admin' },
  }
);

userSchema.index(
  { tenantId: 1, email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      tenantId: { $type: 'objectId' },
      role: { $in: ['business_admin', 'staff', 'customer'] },
    },
  }
);

module.exports = mongoose.model('User', userSchema);