const mongoose = require('mongoose');

// Sub-schemas for activity, accommodation, and travel details
const activitySchema = new mongoose.Schema({
    name:{ 
        type: String, 
       required: true 
    },
    activity_id:{
        type:mongoose.Schema.Types.ObjectId,
        auto:true
    },
    description: {
         type: String, 
         required: true 
        },
    category_id:{
        type:mongoose.Schema.Types.ObjectId, 
        ref: "Category",
        required:true
        },
    activity_images: [{
         type: String 
        }],
    duration: {
         type: String, 
         required: true 
        },
    time: {
         type: String, 
         required: true
         },
});

const accommodationSchema = new mongoose.Schema({
    hotel_type: { 
        type: String, 
        required: true 
    },
    hotel_name: { 
        type: String, 
        required: true 
    },
    hotel_image: [{ 
        type: String,
        required: true 
    }],
    category_id:{
        type:mongoose.Schema.Types.ObjectId, 
        ref: "Category",
        required:true
    },
    rating: { 
        type: String, 
        required: true 
    },
    location: {
         type: String, 
         required: true 
    },
    booking_date: { 
        type: Date, 
        required: true 
    },
    duration: { 
        type: String, 
        required: true 
    },
});

const travelSchema = new mongoose.Schema({
    mode: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    duration: { type: String, required: true },
});

// Schema for daily trip plan, which is now category-specific
const tripPlanSchema = new mongoose.Schema({
    day: { type: Number, required: true },
    day_heading: { type: String, required: true },
    description: { type: String, required: true },
    activities: [activitySchema],
    accommodation: [accommodationSchema],
    travel: [travelSchema],
    food: [{ type: String }]
});

// Schema for package categories with specific features, pricing, and trip plans
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description:{type:String},
    features: [{ type: String, required: true }],    // List of unique features for this category
    price: { type: Number, required: true },         // Price specific to this category
    trip_plan: [tripPlanSchema]                      // Unique trip plan for this category
});

// Main package schema with categories and general details
const packageSchema = new mongoose.Schema({
    package_id: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },  // General package description
    profileImage: { type: String, required: true },
    images: [{ type: String }],
    dates: [{ type: Date }],
    offer: { type: String, required: true },
    price: { 
        regular: { type: Number, required: true },
        discounted: { type: Number }
    },
    categories: {   // Four categories with individual trip plans and features
        silver: categorySchema,
        gold: categorySchema,
        platinum: categorySchema,
        customization: categorySchema
    }
});

const Packages = mongoose.model('Packages', packageSchema);

module.exports = Packages;
