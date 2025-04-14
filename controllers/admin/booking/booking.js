// controllers/bookingController.js

const { Booking, BookingCounter } = require("../../../model/admin/bookingModel");

// Generate a unique booking ID
const generateBookingId = async (packageName, categoryName) => {
  const pkg = packageName.slice(0, 3).toUpperCase();
  const cat = categoryName.slice(0, 3).toUpperCase();
  const key = `${pkg}-${cat}`;

  const counter = await BookingCounter.findOneAndUpdate(
    { key },
    { $inc: { count: 1 } },
    { new: true, upsert: true }
  );

  const paddedNumber = String(counter.count).padStart(3, "0");
  return `${pkg}-${cat}-${paddedNumber}`;
};

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { bookingInfo, passengerDetails, paymentDetails, packageDetails } = req.body;

    const bookingNumber = await generateBookingId(packageDetails.name, packageDetails.category);

    const now = new Date();
    const bookingDateTime = now.toDateString() + ', ' + now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

    const newBooking = new Booking({
      bookingNumber,
      bookingDateTime,
      bookingInfo: {
        name: bookingInfo.name,
        email: bookingInfo.email,
        phone: bookingInfo.phone,
        bookingNumber,
        bookingDateTime
      },
      passengerDetails,
      paymentDetails,
      packageDetails
    });

    await newBooking.save();

    res.status(201).json({
      message: "Booking created and submitted for verification.",
      booking: newBooking
    });
  } catch (error) {
    console.error("Create Booking Error:", error);
    res.status(500).json({
      message: "Error creating booking",
      error: error.message
    });
  }
};

// Fetch a single booking by ID
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

// Update booking status (if needed)
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

module.exports = {
  generateBookingId,
  createBooking,
  getBooking,
  updateBookingStatus
};
