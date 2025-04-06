const express = require('express');
const fileUpload = require("express-fileupload");
const { createCategory, getAllCategories, getCategory, deleteCategory, updateCategory } = require('../../../controllers/admin/category/categoryController');

const fileUploadOptions={
    useTempFiles: true,
    tempFileDir: "./temp",
}

const categoryRouter = express.Router();
categoryRouter.post("/", createCategory);
categoryRouter.get("/:package_id",getAllCategories);
categoryRouter.get("/single/:category_id",getCategory);
categoryRouter.put("/:category_id",fileUpload(fileUploadOptions),updateCategory);
categoryRouter.delete("/:category_id",deleteCategory);

module.exports = categoryRouter;