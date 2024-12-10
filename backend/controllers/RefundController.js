const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Issue Refund
async function issueRefund(req, res) {
    const { paymentIntentId, amount, reason, bookingId } = req.body;

    try {
        // Create refund using Stripe (example)
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: amount * 100, // Refund amount in cents
        });

        // Update payment record in the database
        await Payment.updateOne({ payment_intent_id: paymentIntentId }, { status: 'refunded' });

        res.status(200).send({ message: 'Refund processed successfully' });
    } catch (error) {
        console.error('Refund failed:', error);
        res.status(500).send({ message: 'Refund failed', error: error.message });
    }
}
