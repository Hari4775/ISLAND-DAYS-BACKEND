const express = require("express");
const authRoute = require("./authRouter");
const testRouter = require("./test");
const PackageRouter = require("./packages/PackageRoutes");
const categoryRouter = require("./category/category");
const dayPlanRouter = require("./dayplan/dayplanRoutes");
const DelectCloudinary = require("../../controllers/admin/cloudinary/CloudianaryController");
const { createBooking } = require("../../controllers/admin/booking/booking");
const bookingRouter = require("./bookingRouter");
const adminRouter= express.Router();

adminRouter.use("/auth",authRoute);
adminRouter.use("/packages",PackageRouter);
adminRouter.use("/category",categoryRouter);
adminRouter.use("/plan",dayPlanRouter);
adminRouter.post("/delete-image",DelectCloudinary)
adminRouter.use("/booking",bookingRouter);


adminRouter.use("/",testRouter);

module.exports = adminRouter; 

