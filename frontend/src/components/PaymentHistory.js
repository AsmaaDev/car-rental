import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/payments');
        console.log(response.data.payments); // Inspect data structure
        setPayments(response.data.payments);
      } catch (error) {
        console.error('Error fetching payment history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleRefund = async (paymentId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/payments/${paymentId}/refund`);
      alert(`Refund processed successfully for payment ID: ${paymentId}`);
      
      // Optionally, update the UI after refund
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment._id === paymentId ? { ...payment, status: 'Refunded' } : payment
        )
      );
    } catch (error) {
      console.error('Error processing refund:', error);
      alert('Failed to process the refund.');
    }
  };

  return (
    <div>
      <Sidebar />
      <h2>Payment History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Booking ID</th>
              <th>customer ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id}>

                <td>{payment.bookingId ? payment.bookingId._id : 'N/A'}</td>
                <td>{payment.bookingId ? payment.bookingId._id : 'N/A'}</td>
                <td>{payment.userId ? payment.userId.name : 'N/A'}</td>
                <td>{payment.amount || 'N/A'}</td>
                <td>{payment.status || 'N/A'}</td>
                <td>{payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>
                  {payment.status !== 'Refunded' ? (
                    <button
                      onClick={() => handleRefund(payment._id)}
                      style={{ padding: '5px 10px', backgroundColor: '#f00', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                      Refund
                    </button>
                  ) : (
                    <span>Refunded</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PaymentHistory;
