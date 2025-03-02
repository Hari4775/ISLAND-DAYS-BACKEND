const mongoose = require('mongoose');

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

const Accomodation = mongoose.model('Accomodation',accommodationSchema);

module.exports = Accomodation;