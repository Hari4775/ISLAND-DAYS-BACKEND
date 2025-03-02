const express = require('express');
const { createPackage,  updatePackage,  getPackage, deletePackage, getPackages } = require('../../../controllers/admin/packages/packagesController');
const fileUpload = require("express-fileupload");

const fileUploadOptions={
    useTempFiles: true,
    tempFileDir: "./temp",
}


const PackageRouter = express.Router();
PackageRouter.post("/",fileUpload(fileUploadOptions), createPackage);
PackageRouter.get("/",getPackages);
PackageRouter.get("/:package_id",getPackage);
PackageRouter.put("/:package_id", updatePackage);
PackageRouter.delete("/:package_id",deletePackage);

module.exports = PackageRouter;