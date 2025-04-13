// controllers/bookingController.js

const Booking = require("../../../model/admin/booking");



const createBooking = async (req, res) => {
  try {
    const { bookingNumber, bookingDateTime, bookingInfo, passengerDetails, paymentStatus, packageDetails } = req.body;
    const newBooking = new Booking({ bookingNumber, bookingDateTime, bookingInfo, passengerDetails, paymentStatus, packageDetails });
    await newBooking.save();
    res.status(201).json({ message: "Booking created and submitted for verification.", booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error: error.message });
  }
};

const getBooking = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking", error: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found." });
    }
    res.status(200).json({ message: "Booking status updated.", booking: updatedBooking });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking status", error: error.message });
  }
};

module.exports = { createBooking, getBooking, updateBookingStatus };
