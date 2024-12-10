const express = require('express')
const userController = require('../controllers/userController')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const multerMiddleware = require('../middlewares/multerMiddleware')
const foodController = require('../controllers/foodController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')
const adminController = require('../controllers/adminController')

const router = new express.Router()

//register : http://localhost:4000/register
router.post('/register',userController.registerController)

//login : http://localhost:4000/login
router.post('/login',userController.loginController)

//add-food : http://localhost:4000/add-food
router.post('/add-food',jwtMiddleware,multerMiddleware.single('foodImg'),foodController.adminAddFoodController)

//all-foods : http://localhost:4000/all-foods
router.get('/all-foods',jwtMiddleware,foodController.allFoodsController)

//foods/id : http://localhost:4000/foods/id/remove
router.delete('/foods/:id',jwtMiddleware,foodController.removeFoodController)

//foods/10/edit : http://localhost:4000/foods/id/edit
// : is used because id is a dynamically changed value
router.put('/edit-food/:id/edit',jwtMiddleware,multerMiddleware.single('foodImg'),foodController.editFoodController)

//all-foodsDb : http://localhost:4000/all-foodsDb
router.get('/all-foodsDb',foodController.allFoodDBProjectController)

//all-foodsDb : http://localhost:4000/id/view
// router.get('/foods/:id/view',foodController.getSingleFoodController)
router.get('/view/:id', foodController.getSingleFoodController);

//other-foodsDb : http://localhost:4000/id/view
// router.get('/foods/:id/view',foodController.getSingleFoodController)
router.get('/otherfood/:id', foodController.getOtherFoodController);

// //cart
router.post('/cart',jwtMiddleware, cartController.addToCartController);

//get cart details
// Get Cart Details
router.get('/cart-details',jwtMiddleware, cartController.getCartController);

// delete item from cart
router.delete('/cart/:foodId', jwtMiddleware, cartController.removeItemFromCart);

// // Search endpoint
// router.get('/search', foodController.searchFoodsController);

// Create a new order
router.post("/orders", jwtMiddleware, orderController.createOrderController);

// Route to update quantity
router.put('/quantity/:foodId', jwtMiddleware, cartController.updateCartQuantityController);

router.delete('/clear-cart', jwtMiddleware, cartController.clearCartController);

// Route to fetch recent orders with customer details
router.get('/recent-orders', jwtMiddleware, adminController.getRecentOrdersController);

// Route to get admin statistics
router.get('/admin-stats', jwtMiddleware, adminController.getAdminStatsController);

module.exports = router