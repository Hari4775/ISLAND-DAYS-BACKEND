const mongoose = require('mongoose')


const categorySchema = new mongoose.Schema({
     package_id:{
          type:mongoose.Schema.Types.ObjectId, 
           ref: "Package",required:true
           },
     category_id:{
          type:mongoose.Schema.Types.ObjectId,
          auto:true
     },
     categoryName:{
          type:String,
          required:true,
     },
     categoryFeatures:{
          type:[String],
     },
     categoryDescription:{
          type:[String],
     },
     
     categoryRegularPrice: { 
          type: Number,  
     }, 
     categoryDiscountedPrice:{
          type:Number
     },
     categoryOffer: {
           type: Number
          },
     categoryImage:{
          type:String
     },
     categoryImageCloudinaryId:{
          type:String
     },     
});

const Category = mongoose.model("Category",categorySchema);

module.exports = Category;