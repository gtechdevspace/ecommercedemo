-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'created',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
