import { Router } from "express";
import { addItem, createOrder, deleteOrder, getOrderById, listOrders, updateOrder, updateOrderStatus, updatePayment } from "../controllers/orderContrller.js";

const router = Router();

// CRUD
router.post('/', createOrder);
router.get('/', listOrders);
router.get('/:id', getOrderById);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

// Specific updates
router.patch('/:id/status', updateOrderStatus);
router.patch('/:id/payment', updatePayment);

// Items
router.post('/:id/items', addItem);

export default router;
