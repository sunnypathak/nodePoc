const { Order, Cart } = require("../models/order");

//get Order By id
exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json({
          error: "No order found in DB",
        });
      }
      req.order = order;
      next();
    });
};

//Create Order
exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to save your order",
      });
    }
    res.json(order);
  });
};

//read
exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name email")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: "No Orders found",
        });
      }
      res.json(orders);
    });
};

//get order status
exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

//update status
exports.updateOrderStatus = (req, res) => {
  Order.update(
    { _id: req.body._id },
    { $set: req.body.status },
    (err, order) => {
      if (err) {
        return res.status(400).json({
          error: "status updation failed",
        });
      }
      res.json(order);
    }
  );
};
