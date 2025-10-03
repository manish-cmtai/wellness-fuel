import {model, Schema} from 'mongoose';



const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  { _id: false }
);

const AddressSchema = new Schema(
  {
    fullName: { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String, default: 'India' },
    phone: { type: String }
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, 
    shippingAddress: AddressSchema,
    items: { type: [OrderItemSchema], default: [] },
    paymentMethod: {
      type: String,
      enum: ['Credit Card', 'Debit Card', 'NetBanking', 'UPI', 'COD', 'Wallet'],
      default: 'Credit Card'
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Failed', 'Refunded'],
      default: 'Pending'
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
      default: 'Pending'
    },
    trackingNumber: { type: String },
    shippingCost: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    notes: { type: String },
    isPaid: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Compute subtotal and total before validation/save
OrderSchema.pre('validate', function (next) {
  try {
    if (Array.isArray(this.items) && this.items.length > 0) {
      this.subtotal = this.items.reduce((sum, it) => {
        const itemTotal = typeof it.total === 'number' ? it.total : (it.price || 0) * (it.quantity || 0);
        return sum + itemTotal;
      }, 0);
    } else {
      this.subtotal = 0;
    }

    this.totalAmount = this.subtotal + (this.shippingCost || 0);
    this.isPaid = this.paymentStatus === 'Paid';
    next();
  } catch (err) {
    next(err);
  }
});

const Order = model('Order', OrderSchema);

export default Order;
