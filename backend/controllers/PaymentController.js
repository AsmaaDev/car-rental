const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Stripe integration example

const nodemailer = require('nodemailer');
const Payment = require('../models/Payment');


async function getPaymentHistory(req, res) {
    try {
        const payments = await Payment.find(); // Get all payment records
        res.status(200).send({ payments });
    } catch (error) {
        console.error('Error fetching payment history:', error);
        res.status(500).send({ message: 'Error fetching payment history' });
    }
}  

// Process payment
async function processPayment(req, res) {
    const { amount, paymentMethodId, bookingId, userId } = req.body;

    try {
        // Create PaymentIntent with Stripe (for example)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Amount in cents
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true,
        });

        // Save payment info to the database (e.g., Payments table)
        const paymentData = {
            userId,
            bookingId,
            amount,
            status: 'successful',
            payment_method: 'credit_card', // or 'online_banking'
            payment_intent_id: paymentIntent.id,
        };

        // Save the payment data to your database (e.g., MongoDB, MySQL)
        // Example with MongoDB
        await Payment.create(paymentData);

        res.status(200).send({ message: 'Payment processed successfully', paymentIntentId: paymentIntent.id });
    } catch (error) {
        console.error('Payment failed:', error);
        res.status(500).send({ message: 'Payment failed', error: error.message });
    }
}


async function sendPaymentConfirmation(paymentId) {
    try {
        // Find the payment record
        const payment = await Payment.findById(paymentId);

        // Send email notification
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: 'no-reply@yourdomain.com',
            to: payment.userEmail,
            subject: 'Payment Confirmation',
            text: `Your payment of $${payment.amount} was successfully processed for booking #${payment.bookingId}.`,
        };

        await transporter.sendMail(mailOptions);

        // Optionally, send SMS notification using Twilio
        // const twilioClient = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
        // await twilioClient.messages.create({
        //   to: payment.userPhone,
        //   from: process.env.TWILIO_PHONE_NUMBER,
        //   body: `Payment of $${payment.amount} received for booking #${payment.bookingId}.`,
        // });

        return { message: 'Payment confirmation sent' };
    } catch (error) {
        console.error('Error sending payment confirmation:', error);
        throw new Error('Error sending confirmation');
    }
}
