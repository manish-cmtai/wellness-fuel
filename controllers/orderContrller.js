import mongoose from 'mongoose';
import Order from '../models/orderModel.js';



// Utils
const isValidId = (id) => mongoose.isValidObjectId(id);

// Create
export async function createOrder(req, res) {
  try {
    const order = new Order(req.body);
    const saved = await order.save();
    await saved.populate([
      { path: 'user', select: 'firstName lastName email' },
      { path: 'items.product', select: 'name price' }
    ]);
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.orderNumber) {
      return res.status(409).json({ error: 'Order number already exists' });
    }
    res.status(400).json({ error: err.message });
  }
}


export async function listOrders(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      paymentStatus,
      user,
      q,
      sort = '-createdAt'
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (user && isValidId(user)) filter.user = user;
    if (q) {
      filter.$or = [
        { orderNumber: new RegExp(q, 'i') },
        { trackingNumber: new RegExp(q, 'i') }
      ];
    }

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate({ path: 'user', select: 'firstName lastName email' })
        .populate({ path: 'items.product', select: 'name price' })
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Order.countDocuments(filter)
    ]);

    res.json({
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


export async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid order id' });

    const order = await Order.findById(id)
      .populate({ path: 'user', select: 'firstName lastName email' })
      .populate({ path: 'items.product', select: 'name price' });

    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


export async function updateOrder(req, res) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid order id' });

    const updated = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    })
      .populate({ path: 'user', select: 'firstName lastName email' })
      .populate({ path: 'items.product', select: 'name price' });

    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


export async function deleteOrder(req, res) {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid order id' });

    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted', id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid order id' });
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const updated = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


export async function updatePayment(req, res) {
  try {
    const { id } = req.params;
    const { paymentStatus, paymentMethod, transactionId } = req.body;
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid order id' });

    const payload = {};
    if (paymentStatus) payload.paymentStatus = paymentStatus;
    if (paymentMethod) payload.paymentMethod = paymentMethod;
    if (transactionId) payload.trackingNumber = transactionId; // or store elsewhere

    // recompute isPaid flag
    if (paymentStatus) payload.isPaid = paymentStatus === 'Paid';

    const updated = await Order.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


export async function addItem(req, res) {
  try {
    const { id } = req.params;
    const item = req.body; // { product, name, quantity, price, total? }
    if (!isValidId(id)) return res.status(400).json({ error: 'Invalid order id' });
    if (!item?.product || !item?.name || !item?.quantity || !item?.price) {
      return res.status(400).json({ error: 'product, name, quantity, price are required' });
    }
    item.total = item.total ?? item.price * item.quantity;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.items.push(item);
    await order.validate(); // triggers pre-validate recompute of totals
    const saved = await order.save();

    await saved.populate({ path: 'items.product', select: 'name price' });
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
