const foods = require("../models/foodModel");
const Order = require("../models/orderModel");
const users = require("../models/userModel");

 
exports.createOrderController = async (req, res) => {
  console.log("Inside createOrderController");

  try {
    const { cartItems, totalAmount, name, email, shippingAddress, paymentMethod } = req.body;
    const userId = req.userId;

    console.log("Request data:", { userId, cartItems, totalAmount, name, email, shippingAddress, paymentMethod });

    // Validate request data
    if (!userId || !cartItems || !totalAmount || !name || !email || !shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check cartItems structure
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart items are required and should be an array" });
    }

    // Map cartItems to match schema
    const items = cartItems.map((item) => {
      if (!item.foodId || !item.quantity) {
        throw new Error("Invalid cart item structure");
      }
      return {
        foodId: item.foodId,
        quantity: item.quantity,
      };
    });

    // Fetch the logged-in user's information (from the database)
    const user = await users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Fetched User:", user);

    // Check if the submitted name and email match the logged-in user's details
    if (
      user.username.trim().toLowerCase() !== name.trim().toLowerCase() ||
      user.email.trim().toLowerCase() !== email.trim().toLowerCase()
    ) {
      return res.status(403).json({ message: "You cannot place an order with a different name or email" });
    }

    // Create a new order
    const newOrder = new Order({
      userId,
      items, // Add the items array
      totalAmount,
      name,
      email,
      shippingAddress,
      paymentMethod,
    });

    // Save to database
    await newOrder.save();
    console.log("Order saved:", newOrder);

    return res.status(200).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error.message);
    return res.status(500).json({ message: "Failed to place order", error: error.message });
  }
};

exports.getOrderFoodDetails = async (req, res) => {
  const { foodId } = req.body;
  try {
    const foodDetails = await foods.find({ _id: { $in: foodId } });
    res.json({ success: true, foodDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching food details' });
  }
};




  