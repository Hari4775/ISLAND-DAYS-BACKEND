const cloudinary = require("../../../config/cloudinary");
const fs = require("fs");
const TripPlan = require("../../../model/admin/dayplanModel");
const mongoose = require('mongoose');

// Create a new plan
// const createPlan = async (req, res) => {
//     try {
//         const { day, day_heading, category_id, description, food,activities,accommodation } = req.body;

//         console.log(req.body)
//         const {activity_images} =req.files;
//         const {accomodationImage}=req.files;
        
//         console.log(req.files,"files")

//         if (!day || !category_id) {
//             return res.status(400).json({ message: "Required fields are missing" });
//         }

//         let activityImageUrls = [];
//         let activityImageCloudinaryIds = [];
//         let accomodationImageUrls = [];
//         let accomodationImageCloudinaryIds = [];

//         if (activity_images) {
//                     const activityImageFiles = Array.isArray(activity_images) ? image : [image];
//                     for (const img of activityImageFiles) {
//                         const { tempFilePath } = img;
//                         const { secure_url, public_id } = await cloudinary.uploader.upload(tempFilePath, {
//                             folder: "island_days",
//                         });
//                         activityImageUrls.push(secure_url);
//                         activityImageCloudinaryIds.push(public_id);
//                         fs.unlinkSync(tempFilePath);
//                     }
//                 }
        
//                 console.log(imageUrls, "image urls");

//         if(accomodationImage){
//             const accomodationImageFiles = Array.isArray(accomodationImage) ? image : [image];
//             for (const img of accomodationImageFiles) {
//                 const { tempFilePath } = img;
//                 const { secure_url, public_id } = await cloudinary.uploader.upload(tempFilePath, {
//                     folder: "island_days",
//                 });
//                 accomodationImageUrls.push(secure_url);
//                 accomodationImageCloudinaryIds.push(public_id);
//                 fs.unlinkSync(tempFilePath);
//             }

//         }

//         const validCategoryId = new mongoose.Types.ObjectId(category_id);

//         // ✅ Ensure activities & accommodation are parsed correctly
//         const parsedActivities = activities ? JSON.parse(activities) : [];
//         const parsedAccommodation = accommodation ? JSON.parse(accommodation) : [];
//         const parsedFood = food ? JSON.parse(food) : [];

//         const newPlan = await TripPlan.create({
//             day,
//             day_heading,
//             category_id: validCategoryId,
//             description,
//             food: parsedFood,
//             activities: parsedActivities,
//             accommodation: parsedAccommodation,
//         });


//         res.status(201).json({ message: "Plan created successfully", plan: newPlan });
//     } catch (error) {
//         console.error("Error creating plan:", error.message);
//         res.status(500).json({ message: "Failed to create plan" });
//     }
// };



const createPlan = async (req, res) => {
    try {
        const { day, day_heading, category_id,package_id, description, foods, activities, accommodations } = req.body;

        console.log(req.body);

        if (!day || !category_id || !package_id) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        // Ensure category_id is a valid ObjectId
        const validCategoryId = new mongoose.Types.ObjectId(category_id);
        const validPackageId = new mongoose.Types.ObjectId(package_id);

        // Ensure images are formatted correctly as objects
        const formattedActivities = activities.map(activity => ({
            ...activity,
            activity_images: activity.activity_images.map(imageUrl => ({
                image: imageUrl,
                cloudinaryImageId: extractCloudinaryId(imageUrl) // Function to extract ID
            }))
        }));

        const formattedAccommodations = accommodations.map(accommodation => ({
            ...accommodation,
            hotel_images: accommodation.hotel_images.map(imageUrl => ({
                image: imageUrl,
                cloudinaryImageId: extractCloudinaryId(imageUrl)
            }))
        }));

        const formattedFoods = foods.map(food => ({
            ...food,
            food_images: food.food_images.map(imageUrl => ({
                image: imageUrl,
                cloudinaryImageId: extractCloudinaryId(imageUrl)
            }))
        }));

        // Create the new plan
        const newPlan = await TripPlan.create({
            day,
            day_heading,
            category_id: validCategoryId,
            package_id: validPackageId,
            description,
            foods: formattedFoods,
            activities: formattedActivities,
            accommodations: formattedAccommodations
        });

        res.status(201).json({ message: "Plan created successfully", plan: newPlan });
    } catch (error) {
        console.error("Error creating plan:", error);
        res.status(500).json({ message: "Failed to create plan", error: error.message });
    }
};

// Helper function to extract Cloudinary image ID from URL
const extractCloudinaryId = (url) => {
    const parts = url.split("/");
    return parts[parts.length - 1].split(".")[0]; // Extracts 'cdl6g5icfwz8ppgp8qdq' from the URL
};




// Update an existing plan
const updatePlan = async (req, res) => {
    try {
        const { plan_id } = req.params;
        const { day, day_heading, category_id, description, activities, accommodation, food } = req.body;
        const { activity_images, hotel_images } = req.files;

        const planToUpdate = await TripPlan.findById(plan_id);
        if (!planToUpdate) {
            return res.status(404).json({ message: "Plan not found" });
        }

        // Upload activity images
        let updatedActivityImages = planToUpdate.activities.map(activity => activity.activity_images);
        if (activity_images) {
            const imageFiles = Array.isArray(activity_images) ? activity_images : [activity_images];
            updatedActivityImages = [];
            for (let image of imageFiles) {
                const { tempFilePath } = image;
                const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: "plans" });
                updatedActivityImages.push(secure_url);
                fs.unlinkSync(tempFilePath);
            }
        }

        // Upload accommodation images
        let updatedHotelImages = planToUpdate.accommodation.map(acc => acc.hotel_image);
        if (hotel_images) {
            const imageFiles = Array.isArray(hotel_images) ? hotel_images : [hotel_images];
            updatedHotelImages = [];
            for (let image of imageFiles) {
                const { tempFilePath } = image;
                const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: "hotels" });
                updatedHotelImages.push(secure_url);
                fs.unlinkSync(tempFilePath);
            }
        }

        planToUpdate.day = day || planToUpdate.day;
        planToUpdate.day_heading = day_heading || planToUpdate.day_heading;
        planToUpdate.category_id = category_id || planToUpdate.category_id;
        planToUpdate.description = description || planToUpdate.description;
        planToUpdate.activities = activities
            ? activities.map(activity => ({
                  ...activity,
                  activity_images: updatedActivityImages
              }))
            : planToUpdate.activities;
        planToUpdate.accommodation = accommodation
            ? accommodation.map(acc => ({
                  ...acc,
                  hotel_image: updatedHotelImages
              }))
            : planToUpdate.accommodation;
        planToUpdate.food = food || planToUpdate.food;

        const updatedPlan = await planToUpdate.save();
        res.status(200).json({ message: "Plan updated successfully", plan: updatedPlan });
    } catch (error) {
        console.error("Error updating plan:", error.message);
        res.status(500).json({ message: "Failed to update plan" });
    }
};

// Delete a plan
const deletePlan = async (req, res) => {
    try {
        const { plan_id } = req.params;
        const planToDelete = await TripPlan.findById(plan_id);
        if (!planToDelete) {
            return res.status(404).json({ message: "Plan not found" });
        }

        await TripPlan.findByIdAndDelete(plan_id);
        res.status(200).json({ message: "Plan deleted successfully" });
    } catch (error) {
        console.error("Error deleting plan:", error.message);
        res.status(500).json({ message: "Failed to delete plan" });
    }
};

// Get all plans
const getPlans = async (req, res) => {

    try {
        const { category_id } = req.params;

        if (!category_id) {
            return res.status(400).json({ message: "category ID is required" });
        }
    
        const plans = await TripPlan.find({category_id});
        res.status(200).json({ plans });
    } catch (error) {
        console.error("Error fetching plans:", error.message);
        res.status(500).json({ message: "Failed to fetch plans" });
    }
};

const singlePlan = async (req,res)=>{
    try{
        const {plan_id} = req.params;
        const plans = await TripPlan.findOne({plan_id});
        if(!plans){
            return res.status(404).json({message:"Plan not found"});
        }
        res.status(200).json({plans});
    }catch(err){
        console.log("error for getting the trip plan details",err.message)
    }
}

module.exports = {
    createPlan,
    updatePlan,
    deletePlan,
    getPlans,
    singlePlan
};
