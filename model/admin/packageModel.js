const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    package_id:{
        type:mongoose.Schema.Types.ObjectId,
        auto:true
    },
    package_name:{
        type:String ,
        required:true
    },
    description:{
        type:String
    },
    created_date:{
        type:Date,
        default:Date.now
    },
    updated_date:{
        type:Date,
        default:Date.now
    },
    regular_price: {
         type: Number,
         required: true
    },
    discounted_price: {
         type: Number 
    },
    discount_rate:{
        type:Number
    },
    coverImage:String,      
    coverImageCloudinaryId:String,

})

const Package = mongoose.model("Package",packageSchema);

module.exports = Package;