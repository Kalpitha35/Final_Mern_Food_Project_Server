const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({
    foodName:{
        type:String,
        required:true,
        unique:true

    },
    category:{
        type:String,
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        
    },
    foodImg:{
        type:String,
        required:true
    },
    foodType:{
        type:String,
        
    }


})

const foods = mongoose.model("foods",foodSchema)
module.exports = foods