-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
  product_id BIGINT PRIMARY KEY,
  stock INTEGER NOT NULL DEFAULT 0,
  reserved INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT now()
);

-- Reservations to ensure idempotency per order
CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  qty INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(order_id, product_id)
);
