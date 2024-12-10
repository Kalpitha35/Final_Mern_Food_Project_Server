const foods = require('../models/foodModel')
const users = require('../models/userModel')
const Order = require("../models/orderModel");

// Fetch recent orders
exports.getRecentOrdersController = async (req, res) => {
    console.log("Inside getRecentOrdersController");
    
    try {
        // Fetch recent orders and populate user details
        const recentOrders = await Order.find()
          .sort({ createdAt: -1 }) // Sort by most recent
          .limit(10) // Limit to the 10 most recent orders
          .populate('userId', 'name email'); // Populate 'name' and 'email' fields from User
    
        res.status(200).json(recentOrders);
      } catch (error) {
        console.error('Error fetching recent orders with customers:', error);
        res.status(500).json({ message: 'Failed to fetch recent orders with customers' });
      }
  };

// count of registered users, orders and total revenue
exports.getAdminStatsController = async (req, res) => {
    try {
      const totalOrders = await Order.countDocuments({});
      const totalUsers = await users.countDocuments({});
      const totalRevenue = await Order.aggregate([
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]);
  
      res.status(200).json({
        totalOrders,
        totalUsers,
        totalRevenue: totalRevenue[0]?.total || 0,
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  };
  