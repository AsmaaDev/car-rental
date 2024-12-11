const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// Admin: List all payments
exports.listAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('bookingId userId');
    res.status(200).json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Customer: Create a new payment
exports.createPayment = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const payment = await Payment.create({
      bookingId,
      userId: booking.userId,
      amount,
      status: 'pending'
    });

    res.status(201).json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Refund a payment
exports.refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    if (payment.status === 'refunded') {
      return res.status(400).json({ success: false, message: 'Payment is already refunded' });
    }

    payment.status = 'refunded';
    await payment.save();

    res.status(200).json({ success: true, message: 'Payment refunded successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
