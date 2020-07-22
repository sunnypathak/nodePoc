const express = require("express");
const router = express.Router();

const {
  isAdmin,
  isSignedIn,
  isAuthenticated,
} = require("../controllers/authenticate");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const {
  getOrderById,
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStatus,
} = require("../controllers/order");
const { updateStock } = require("../controllers/product");
//param
router.param("userId", getUserById);
router.param("orderId", getOrderById);

//Actual Routes
router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticated,
  pushOrderInPurchaseList,
  updateStock,
  createOrder
);
//read
router.get(
  "order/all/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllOrders
);

//status
router.get(
  "/order/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getOrderStatus
);
router.put(
  "/order/:orderId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateOrderStatus
);
module.exports = router;
