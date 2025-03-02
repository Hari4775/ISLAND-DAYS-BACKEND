const mongoose = require('mongoose');

// Sub-schemas for activity, accommodation, and travel details
const activitySchema = new mongoose.Schema({
    activity_id:{
        type:mongoose.Schema.Types.ObjectId,
        auto:True
    },
    name:{ 
        type: String, 
       required: true 
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

const Accomodation = new mongoose.Schema("Activity",activitySchema);
module.exports = Accomodation;