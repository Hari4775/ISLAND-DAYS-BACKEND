const Category = require("../../../model/admin/categoryModel");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: "dr1ogkaha",
    api_key: "your_api_key",
    api_secret: "your_api_secret",
  });


// Create a new category
const createCategory = async (req, res) => {
    try {
        const {     
            package_id,
            categoryName,
            categoryDescription,
            categoryFeatures,
            categoryRegularPrice,
            categoryDiscountedPrice,
            categoryOffer,
            categoryImage,
            categoryImageCloudinaryId,
        } = req.body;

        console.log(req.body, "req body");

        if (!categoryName || !categoryRegularPrice || !package_id) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        const newCategory = await Category.create({
            package_id,
            categoryName,
            categoryDescription,
            categoryFeatures,
            categoryRegularPrice,
            categoryDiscountedPrice,
            categoryOffer,
            categoryImage,
            categoryImageCloudinaryId,
        });
        res.status(200).json({ message: "Category created successfully", category: newCategory });
    } catch (error) {
        console.error("Error creating category:", error.message);
        res.status(500).json({ message: "Failed to create category" });
    }
};


const getAllCategories = async (req, res) => {
    try {
        const { package_id } = req.params;

        if (!package_id) {
            return res.status(400).json({ message: "Package ID is required" });
        }

        const categories = await Category.find({ package_id });

        if (categories.length === 0) {
            return res.status(404).json({ message: "No categories found for this package ID" });
        }

        res.status(200).json({ message: "Categories retrieved successfully", categories });
    } catch (error) {
        console.error("Error retrieving categories by package ID:", error.message);
        res.status(500).json({ message: "Failed to retrieve categories" });
    }
};


const getCategory= async (req,res)=>{
    try{   
         const { category_id } = req.params;
         const category = await Category.findOne({category_id});
         if(!category){
             return res.status(404).json({message:"category not available"});
         }
         res.status(200).json(category);
    }catch(error){
        console.log("error getting package",error.message,);
        res.status(500).json({message:'Failed to get package'})
    }
};


// Update an existing category
const updateCategory = async (req, res) => {
    try {
        const { category_id } = req.params;
        const {
            categoryName,
            categoryDescription,
            categoryFeatures,
            categoryRegularPrice,
            categoryDiscountedPrice,
            categoryOffer,
            categoryImage,
            categoryImageCloudinaryId, 
        } = req.body;

     

        const categoryToUpdate = await Category.findOne({category_id});
        if (!categoryToUpdate) {
            return res.status(404).json({ message: "Category not found" });
        }

       if(categoryToUpdate.categoryImageCloudinaryId && categoryImageCloudinaryId !== categoryToUpdate.categoryImageCloudinaryId){
        try{
            await cloudinary.uploader.destroy(categoryToUpdate.categoryImageCloudinaryId);
            console.log("Old image deleted from Cloudinary:", categoryToUpdate.categoryImageCloudinaryId);
        }catch(error){
            console.error("Error deleting old image from Cloudinary",error.message);
        }
       }

        const updatedCategory = await Category.findByIdAndUpdate(
            categoryToUpdate._id,
            {
            categoryName,
            categoryDescription,
            categoryFeatures,
            categoryRegularPrice,
            categoryDiscountedPrice,
            categoryOffer,
            categoryImage,
            categoryImageCloudinaryId, 
            },
            {   new:true}
        );
        res.status(200).json({ message: "Category updated successfully",  updatedCategory });
    } catch (error) {
        console.error("Error updating category:", error.message);
        res.status(500).json({ message: "Failed to update category" });
    }
};

const deleteCategory =async (req,res)=>{
    const {category_id}= req.params;
    try{
       const category =await Category.findOne({category_id});
       if(!category){
        return res.status(404).json({message:"category not available"}); 
       }
       await Category.findByIdAndDelete(category);
       cloudinary.uploader.destroy(category.coverImageCloudinaryId);
       res.json({message:"category deleted successfully"});
    }catch(err){
        console.log("error deleting category",err.message);
        res.status(500).json({messsage:"failed to delete category"});

    }
}
module.exports = {
    createCategory,
    updateCategory,
    getAllCategories,
    getCategory,
    deleteCategory
};
