import React, { useState } from 'react';
import axios from 'axios';

function AdminRefundPage({ paymentIntentId, amount }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRefund = async () => {
    setIsProcessing(true);

    try {
      const response = await axios.post('http://localhost:5000/api/issue-refund', {
        paymentIntentId,
        amount,
      });

      if (response.data.message === 'Refund processed successfully') {
        alert('Refund successfully issued');
      } else {
        alert('Refund failed');
      }
    } catch (error) {
      console.error('Error issuing refund:', error);
      alert('Refund failed');
    }

    setIsProcessing(false);
  };

  return (
    <div>
      <h2>Issue Refund</h2>
      <button onClick={handleRefund} disabled={isProcessing}>
        {isProcessing ? 'Processing...' : 'Issue Refund'}
      </button>
    </div>
  );
}

export default AdminRefundPage;
