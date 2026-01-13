import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY || 'pk_test_xxx');

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    // For demo: call Payment Service endpoint to create a PaymentIntent / charge
    try {
      const res = await fetch('/api/payment/charge', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: 9.99, payment_method: 'pm_card_visa', order_id: 1 }) });
      const data = await res.json();
      alert('Payment result: ' + JSON.stringify(data));
    } catch (err) {
      alert('Payment failed: ' + (err as any).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <div className="mb-3">
        <label className="form-label">Card</label>
        <CardElement />
      </div>
      <button className="btn btn-primary" disabled={loading || !stripe} type="submit">{loading ? 'Processing...' : 'Pay $9.99'}</button>
    </form>
  );
}

export default function Checkout() {
  return (
    <div className="container mt-4">
      <h2>Checkout</h2>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
}
