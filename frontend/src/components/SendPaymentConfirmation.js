import React, { useState } from 'react';
import axios from 'axios';

function SendPaymentConfirmation({ paymentId }) {
  const [isSending, setIsSending] = useState(false);

  const handleSendConfirmation = async () => {
    setIsSending(true);

    try {
      const response = await axios.post('http://localhost:5000/api/send-payment-confirmation', {
        paymentId,
      });

      if (response.data.message === 'Payment confirmation sent') {
        alert('Payment confirmation sent successfully');
      } else {
        alert('Failed to send confirmation');
      }
    } catch (error) {
      console.error('Error sending payment confirmation:', error);
      alert('Failed to send confirmation');
    }

    setIsSending(false);
  };

  return (
    <div>
      <button onClick={handleSendConfirmation} disabled={isSending}>
        {isSending ? 'Sending...' : 'Send Payment Confirmation'}
      </button>
    </div>
  );
}

export default SendPaymentConfirmation;
