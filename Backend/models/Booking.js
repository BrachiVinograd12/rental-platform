const mongoose = require('mongoose');

const bookingItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be an integer.',
      },
    },

    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    items: {
      type: [bookingItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: 'A booking must contain at least one item.',
      },
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
      enum: ['ILS', 'USD', 'EUR'],
    },

    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'active',
        'completed',
        'cancelled',
      ],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.pre('validate', function () {
  if (
    this.startDate &&
    this.endDate &&
    this.endDate <= this.startDate
  ) {
    this.invalidate(
      'endDate',
      'End date must be later than start date.'
    );
  }
});

bookingSchema.index({ tenantId: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ tenantId: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);