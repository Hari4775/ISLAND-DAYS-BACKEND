
// const multer = require('multer');
// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');

// // Cloudinary Configuration
// cloudinary.config({
//     secure: true,
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.CLOUD_API_KEY,
//     api_secret: process.env.CLOUD_API_SECRET,
// });

// console.log(cloudinary.config());

// // Configure Multer Storage with Cloudinary
// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'packages', // Folder in Cloudinary
//         allowed_formats: ['jpg', 'jpeg', 'png'],
//     },
// });

// const upload = multer({ storage });

// module.exports = { upload, cloudinary };
