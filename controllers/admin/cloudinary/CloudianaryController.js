
const cloudinary = require("cloudinary").v2;


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const DelectCloudinary = async (req,res) => {
   
       const {publicId} = req.body;
       if(!publicId) return res.status(404).json({error:'public id is required'});

    try{
        await cloudinary.uploader.destroy(publicId);
        res.json({ success: true, message: "Image deleted successfully" });
    }catch(error){
        console.error("Cloudinary deletion error:", error);
        res.status(500).json({ error: "Failed to delete image" });
    }

}

module.exports = DelectCloudinary;