
const Package = require("../../../model/admin/packageModel");
const Category =require("../../../model/admin/categoryModel");
const TripPlan =require("../../../model/admin/dayplanModel")
const cloudinary = require("cloudinary").v2;


cloudinary.config({
  cloud_name: "dr1ogkaha",
  api_key: "your_api_key",
  api_secret: "your_api_secret",
});





const createPackage = async (req, res) => {
  try {
    const { package_name, description, regular_price, discounted_price, discount_rate,coverImage,coverImageCloudinaryId

    } = req.body;
   
    console.log(req.body,"package")

    if (!package_name || !regular_price) {
      return res.status(404).json({ message: "Package name and regular price are required" });
    }

   
    // Create the package
    const newPackage = await Package.create({
      package_name,
      description,
      regular_price,
      discounted_price,
      discount_rate,
      coverImage,
      coverImageCloudinaryId
    });

    res.status(200).json({
      message: "Package, categories, and trip plans created successfully",
      newPackage,
    });
  } catch (error) {
    console.error("Error creating package:", error.message);
    res.status(500).json({ message: "Failed to create package" });
  }
};




const getPackages = async(req,res)=>{
    try{
        const packages = await Package.find();
        res.status(200).json({packages})
    }catch(error){
        console.log("error getting packages",error.message,);
        res.status(500).json({message:'Failed to get packages'})
    }
};


const getPackage = async (req,res)=>{
    try{   
         const { package_id } = req.params;
         const package = await Package.findOne({package_id});
         if(!package){
             return res.status(404).json({message:"package not available"});
         }
         res.status(200).json(package);
    }catch(error){
        console.log("error getting package",error.message,);
        res.status(500).json({message:'Failed to get package'})
    }
};



const updatePackage = async (req, res) => {
    try {
      const { package_id } = req.params;
      const { package_name, description, regular_price, discounted_price, discount_rate, coverImage,coverImageCloudinaryId} = req.body;
  
      // Find the package by ID
      const packageToUpdate = await Package.findOne({ package_id });
      if (!packageToUpdate) {
        return res.status(404).json({ message: "Package not available" });
      }
  
        // Delete old image from Cloudinary if it exists
    if (packageToUpdate.coverImageCloudinaryId && coverImageCloudinaryId !== packageToUpdate.coverImageCloudinaryId) {
      try {
        await cloudinary.uploader.destroy(packageToUpdate.coverImageCloudinaryId);
        console.log("Old image deleted from Cloudinary:", packageToUpdate.coverImageCloudinaryId);
      } catch (error) {
        console.error("Error deleting old image from Cloudinary:", error.message);
      }
    }

      // Update the package
      const updatedPackage = await Package.findByIdAndUpdate(
        packageToUpdate._id,
        {
          package_name,
          description,
          regular_price,
          discounted_price,
          discount_rate,
          coverImage,
          coverImageCloudinaryId,
        },
        { new: true }
      );
  
      res.status(200).json({ message: "Package updated successfully", updatedPackage });
    } catch (error) {
      console.error("Error updating package:", error.message);
      res.status(500).json({ message: "Failed to update package" });
    }
  };
  

  const deletePackage = async (req, res) => {
    const { package_id } = req.params;

    try {
     

        // Find the package by package_id
        const package = await Package.findOne({ package_id });
        if (!package) {
            return res.status(404).json({ message: "Package not available" });
        }

        console.log(`Deleting package: ${package.package_id}`);

        // Find all categories associated with the package
          const categories = await Category.find({package_id});
         
          const tripPlan= await TripPlan.find({package_id});    
  
        
        // Delete all categories associated with the package
        if (categories.length > 0) {
            await Category.deleteMany({ package_id: package.package_id });
             console.log("Deleted all related categories.");
        }

        // Delete the package's cover image from Cloudinary
        if (package.coverImageCloudinaryId) {
            await cloudinary.uploader.destroy(package.coverImageCloudinaryId);
            console.log("Deleted package cover image from Cloudinary.");
        }
        if (categories.length > 0) {
          await Promise.all(
              categories.map(async (category) => {
                  if (category.categoryImageCloudinaryId) {
                      await cloudinary.uploader.destroy(category.categoryImageCloudinaryId);
                      console.log("Deleted package category image from Cloudinary.");
                  }
              })
          );
      }

      if(tripPlan){        
        if (tripPlan.activities?.length > 0) {
          await Promise.all(
              tripPlan.activities.flatMap(activity =>
                  activity.activity_images.map(async (imageObj) => {
                      if (imageObj.cloudinaryImageId) {
                          await cloudinary.uploader.destroy(imageObj.cloudinaryImageId);
                          console.log("Deleted activity image from Cloudinary:", imageObj.cloudinaryImageId);
                      }
                  })
              )
          );
      }

      if (tripPlan.accommodations?.length > 0) {
        await Promise.all(
            tripPlan.accommodations.flatMap(accomod =>
                accomod.hotel_images.map(async (imageObj) => {
                    if (imageObj.cloudinaryImageId) {
                        await cloudinary.uploader.destroy(imageObj.cloudinaryImageId);
                        console.log("Deleted accomodation image from Cloudinary:", imageObj.cloudinaryImageId);
                    }
                })
            )
        );
    }

    if (tripPlan.foods?.length > 0) {
      await Promise.all(
          tripPlan.foods.flatMap(food =>
              food.food_images.map(async (imageObj) => {
                  if (imageObj.cloudinaryImageId) {
                      await cloudinary.uploader.destroy(imageObj.cloudinaryImageId);
                      console.log("Deleted food image from Cloudinary:", imageObj.cloudinaryImageId);
                  }
              })
          )
      );
  }
}



        // Delete the package itself
        await Package.findByIdAndDelete(package._id);
        console.log("Deleted package from database.");

        res.json({ message: "Package, categories, trip plans, and all related images deleted successfully" });

    } catch (error) {
        console.error("Error deleting package:", error);
        res.status(500).json({ message: "Failed to delete package", error: error.message });
    }
};




module.exports = {createPackage,getPackages,getPackage,deletePackage,updatePackage,}