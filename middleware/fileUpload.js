const multer =require('multer');

const storage = multer.diskStorage({})
const fileUpload = multer({ storage:storage})

module.exports = fileUpload