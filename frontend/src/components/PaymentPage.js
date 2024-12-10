import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PaymentPage({ bookingId, amount }) {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const response = await axios.post('http://localhost:5000/api/process-payment', {
        amount,
        paymentMethodId: paymentMethod,
        bookingId,
        userId: localStorage.getItem('userId'),
      });

      if (response.data.message === 'Payment processed successfully') {
        // Redirect or show success message
        navigate('/payment-success');
      } else {
        alert('Payment failed');
      }
    } catch (error) {
      console.error('Error during payment:', error);
      alert('Payment processing failed');
    }

    setIsProcessing(false);
  };

  return (
    <div>
      <h2>Complete Payment</h2>
      <div>
        {/* Implement a payment method input, like Stripe's Card Element */}
        <button onClick={handlePayment} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
}

export default PaymentPage;
