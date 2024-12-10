const foods = require('../models/foodModel');

// add-food 
exports.adminAddFoodController = async (req,res)=>{
    console.log("Inside adminAddFoodController");
   
    const {foodName, category, price, description, foodType} = req.body;
    const foodImg = req.file.filename
    console.log(foodName, category, price, description,foodImg,foodType);
    
    try{
        const existingFood = await foods.findOne({foodName})

    if(!foodName || !category ||!price ||!foodImg){
        return res.status(400).json({ message: 'Name, price, and category are required.' });
    }
    if(existingFood){
        res.status(406).json("Food already exist in our collection..... Please upload another!!!")
    }else{
    //create new food Item
    const newFood = new foods({
        foodName,
        category,
        price,
        description,
        foodImg,
        foodType
    });

    await newFood.save();  //Saves this document by inserting a new document into the database

    return res.status(200).json({
        message: 'Food item added successfully!',
        food: newFood,
      });
    }
   }catch (err) {
    console.error('Error in addFoodController:', err.message);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

// all-food
exports.allFoodsController = async (req,res)=>{
    console.log("Inside allFoodsController");
    try {
        const allFoodDetails = await foods.find()
        res.status(200).json(allFoodDetails)
    } catch (error) {
        res.status(401).json(error)
    }
    
}

// removeFood
exports.removeFoodController = async (req,res)=>{
    console.log("Inside removeFoodController");
    const {id} = req.params
    console.log("ID received for deletion:", id);
    try {
        const removeFood = await foods.findByIdAndDelete(id)
        res.status(200).json(removeFood)
    } catch (error) {
        res.status(401).json(error)
    }
}

// editFood
exports.editFoodController = async (req,res)=>{
    console.log("Inside editFoodController");
    const id = req.params.id

    const {foodName,category,price,description,foodImg} = req.body
    const reUploadFoodImage = req.file?req.file.filename:foodImg
    try{
        const updateFood = await foods.findByIdAndUpdate({_id:id},{
            foodName,category,price,description,foodImg:reUploadFoodImage
        },{new:true})
        await updateFood.save()
        res.status(200).json(updateFood)

    }catch(err){
        res.status(401).json(err)
    }
    
}

exports.allFoodDBProjectController = async (req,res)=>{
    console.log("Inside allFoodDBProjectController");
    try{
        const allFoodsFromDb = await foods.find()
        res.status(200).json(allFoodsFromDb)

    }catch(err){
        res.status(401).json(err)
    }
    
}



exports.getSingleFoodController = async (req, res) => {
    console.log("Inside getSingleFoodController");
    const id = req.params.id;
    console.log(id);
    
    try {
        // Use findById correctly
        const getFood = await foods.findById(id);

        if (!getFood) {
            return res.status(404).json({ message: "Food item not found" });
        }

        res.status(200).json(getFood);
    } catch (err) {
        console.error("Error fetching food item:", err);
        res.status(500).json({ error: "Server error, please try again later" });
    }
};

// getOtherFood for View component
exports.getOtherFoodController = async (req,res)=>{
    console.log("Inside getOtherFoodController");
    const id = req.params.id;
    console.log(id);
    try{
        // Query to fetch all foods except the one with the given ID
    const otherFoods = await foods.find({ _id: { $ne: id } });

    // Send the result back as JSON
    res.status(200).json({ status: 200, data: otherFoods });
  } catch (err) {
    console.error('Error fetching other foods:', err);
    res.status(500).json({ status: 500, message: 'Error fetching other foods' });
  
    }
    
}

