import React, { useState } from 'react';
import styles from './paymentPage.module.css';

function PaymentPage() {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null);

  const handlePayment = () => {
    if (paymentMethod === 'bank') {
      setPaymentDetails({
        method: 'Deposit at the Bank',
        reference: `REF${Math.floor(Math.random() * 1000000)}`,
        instructions: 'Please deposit the amount at your nearest bank using the unique reference number provided.'
      });
    } else if (paymentMethod === 'scan') {
      setPaymentDetails({
        method: 'Scan to Pay',
        qrCode: 'https://via.placeholder.com/150', // Placeholder for QR code image
        instructions: 'Please scan the QR code using your banking app to complete the payment.'
      });
    }
  };

  return (
    <div className={styles.paymentPage}>
      <h1>Make a Contribution</h1>
      <label htmlFor="amount">Contribution Amount (R)</label>
      <input
        type="number"
        id="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
      />
      <label htmlFor="paymentMethod">Payment Method</label>
      <select
        id="paymentMethod"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <option value="">Select a payment method</option>
        <option value="bank">Deposit at the Bank</option>
        <option value="scan">Scan to Pay</option>
      </select>
      <button onClick={handlePayment}>Proceed to Payment</button>

      {paymentDetails && (
        <div className={styles.paymentDetails}>
          <h2>Payment Details</h2>
          <p><strong>Method:</strong> {paymentDetails.method}</p>
          {paymentDetails.reference && <p><strong>Reference:</strong> {paymentDetails.reference}</p>}
          {paymentDetails.qrCode && <img src={paymentDetails.qrCode} alt="QR Code" />}
          <p>{paymentDetails.instructions}</p>
        </div>
      )}
    </div>
  );
}

export default PaymentPage;