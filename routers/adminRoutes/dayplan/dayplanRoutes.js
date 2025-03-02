const express = require('express');
const fileUpload = require("express-fileupload");
const { createPlan, getPlans, singlePlan } = require('../../../controllers/admin/trip_plan/trip_plan');

const fileUploadOptions={
    useTempFiles: true,
    tempFileDir: "./temp",
}

const dayPlanRouter = express.Router();
dayPlanRouter.post("/",fileUpload(fileUploadOptions), createPlan);
dayPlanRouter.get("/",singlePlan);
dayPlanRouter.get("/:category_id",getPlans);
// dayPlanRouter.put("/:package_id", fileUpload(fileUploadOptions), updatePackage);
// dayPlanRouter.delete("/:package_id",deletePackage);

module.exports = dayPlanRouter;