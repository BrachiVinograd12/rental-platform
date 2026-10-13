const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: 3000,
    },

    images: {
      type: [String],
      default: [],
      validate: {
        validator: (images) => images.length <= 10,
        message: 'A product can have at most 10 images.',
      },
    },

    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: 'ILS',
      enum: ['ILS', 'USD', 'EUR'],
    },

    totalQuantity: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be an integer.',
      },
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

productSchema.index({ tenantId: 1, isActive: 1 });
productSchema.index({ tenantId: 1, categoryId: 1 });

module.exports = mongoose.model('Product', productSchema);