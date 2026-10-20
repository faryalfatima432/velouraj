import express from "express";

import {
  createOrder,
  createOnlinePayment,
  easypaisaCallback,
  getMyOrders,
  getMyOrderById,
  getAllOrders,
  getAdminOrderById,
  deleteOrder,
  deleteMyOrder,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controllers/orderController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/*
==================================================
CUSTOMER
==================================================
*/

/*
Cash on Delivery
*/
router.post(
  "/",
  protect,
  createOrder
);

/*
Online payment
*/
router.post(
  "/payment/create",
  protect,
  createOnlinePayment
);

/*
Easypaisa callback
*/
router.post(
  "/payment/easypaisa/callback",
  easypaisaCallback
);

/*
Customer orders
*/
router.get(
  "/my-orders",
  protect,
  getMyOrders
);

router.get(
  "/my-orders/:id",
  protect,
  getMyOrderById
);

router.delete(
  "/my-orders/:id",
  protect,
  deleteMyOrder
);

/*
==================================================
ADMIN
==================================================
*/

router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllOrders
);

router.get(
  "/admin/:id",
  protect,
  adminOnly,
  getAdminOrderById
);

router.delete(
  "/admin/:id",
  protect,
  adminOnly,
  deleteOrder
);

router.put(
  "/admin/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);

router.put(
  "/admin/:id/payment-status",
  protect,
  adminOnly,
  updatePaymentStatus
);

export default router;