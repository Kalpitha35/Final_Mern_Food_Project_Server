const foods = require('../models/foodModel')
const users = require('../models/userModel')


// Add to Cart Controller
exports.addToCartController = async (req, res) => {
  console.log('Inside addToCartController');
  console.log('Request body received:', req.body);

  const { userId, foodId, quantity } = req.body;

  try {
    if (!userId || !foodId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid input: userId, foodId, and quantity are required.' });
    }

    const user = await users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Use atomic update to avoid race conditions
    const existingItemIndex = user.cart.findIndex(item => item.foodId.toString() === foodId);
    if (existingItemIndex > -1) {
      // Update existing item quantity
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      user.cart.push({ foodId, quantity });
    }

    const savedUser = await user.save();

    console.log('Updated User Cart:', savedUser.cart);

    return res.status(200).json({ message: 'Item added to cart successfully', cart: savedUser.cart });
  } catch (err) {
    console.error('Error adding to cart:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getCartController = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing or invalid' });
    }

    // Fetch the user and populate food details
    const user = await users.findById(userId)
      .populate('cart.foodId', 'foodName price foodImg') // Fetch food details
      .exec();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.cart.length === 0) {
      return res.status(404).json({ message: 'Cart is empty' });
    }

    // Send back the cart items
    res.json({ cartItems: user.cart });
  } catch (error) {
    console.error('Error fetching cart details:', error); // Log detailed error
    res.status(500).json({ message: 'Error fetching cart details' });
  }
};


// Controller to delete an item from the cart
exports.removeItemFromCart = async (req, res) => {
  const { foodId } = req.params; // Extract foodId from URL params
  const userId = req.userId; // Assume `req.user` contains authenticated user info from middleware

  try {
    // Find the user and remove the item from the cart array
    const user = await users.findByIdAndUpdate(
      userId,
      { $pull: { cart: { foodId } } }, // Remove item with matching foodId
      { new: true } // Return updated document
    ).populate('cart.foodId'); // Optional: Populate cart items with food details

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Item removed from cart', cart: user.cart });
  } catch (error) {
    console.error('Error deleting item from cart:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Update quantity of a cart item

exports.updateCartQuantityController = async (req, res) => {
  const { newQuantity } = req.body;
  const { foodId } = req.params; // Extract foodId from params
  const userId = req.userId; // Assuming user ID is provided by authentication middleware

  if (!foodId || newQuantity < 1) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    // Update the quantity in the user's cart array
    const updatedUser = await users.findOneAndUpdate(
      { _id: userId, "cart.foodId": foodId },
      { $set: { "cart.$.quantity": newQuantity } },
      { new: true } // Return the updated document
    ).populate('cart.foodId'); // Populate the food details in the cart

    if (!updatedUser) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.status(200).json({
      message: 'Quantity updated',
      cartItems: updatedUser.cart, // Return the updated cart
    });
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Clear cart for the user
exports.clearCartController = async (req, res) => {
  console.log("Inside clearCartController");
  
  const userId = req.userId; // Assuming authentication middleware adds `req.user`

  try {
    const user = await users.findByIdAndUpdate(
      userId,
      { $set: { cart: [] } }, // Set the cart array to empty
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Cart cleared successfully', user });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Failed to clear cart' });
  }
};







