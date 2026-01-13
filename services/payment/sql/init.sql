-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL,
  stripe_payment_id TEXT,
  amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'usd',
  status VARCHAR(50) NOT NULL,
  idempotency_key VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT now()
);
