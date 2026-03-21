const Order = require("../models/Order");

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {

    const order = new Order({
      totalPrice: req.body.totalPrice,
      status: "Pending"
    });

    const savedOrder = await order.save();

    res.status(201).json(savedOrder);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ORDERS
exports.getOrders = async (req, res) => {
  try {

    const orders = await Order.find().sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = req.body.status;

    const updatedOrder = await order.save();

    res.json(updatedOrder);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};