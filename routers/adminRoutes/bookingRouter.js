const express =require("express");
const { createBooking, getBooking, updateBookingStatus } = require("../../controllers/admin/booking/booking");

const bookingRouter =express.Router();

bookingRouter.post("/", createBooking);
bookingRouter.get("/:bookingId", getBooking);
bookingRouter.put("/:bookingId", updateBookingStatus);
module.exports = bookingRouter;