'use client';

import { useEffect, useState } from 'react';

export default function Test() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPlans() {
      const res = await fetch('/api/products');
      const data = await res.json();
      setPlans(data);
    }

    fetchPlans();
  }, []);

  const subscribe = async (priceId) => {
    setLoading(true);
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ priceId, customerEmail: 'test@example.com' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Error');
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Available Plans</h1>
      {plans.map((product) => (
        <div key={product.id} style={{ marginBottom: 20 }}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          {product.prices.map((price) => (
            <button
              key={price.id}
              onClick={() => subscribe(price.id)}
              disabled={loading}
              style={{ marginRight: 10 }}
            >
              Subscribe for {(price.unit_amount / 100).toFixed(2)}{' '}
              {price.currency.toUpperCase()} / {price.interval}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

// 'use client';
// import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
// );
// const PRICE_ID = 'price_1NXXXXX';

// const Test = () => {
//   return <SubscribePage />;
// };
// export default Test;

// function SubscribePage() {
//   const handleSubscribe = async () => {
//     const stripe = await stripePromise;

//     const res = await fetch('/api/subscribe', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ priceId: PRICE_ID }),
//     });

//     const { id } = await res.json();
//     stripe.redirectToCheckout({ sessionId: id });
//   };

//   return (
//     <div className="p-6">
//       <button
//         onClick={handleSubscribe}
//         className="bg-blue-600 text-white px-6 py-2 rounded"
//       >
//         Subscribe Now
//       </button>
//     </div>
//   );
// }
