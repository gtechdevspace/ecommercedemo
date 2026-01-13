#!/usr/bin/env bash
set -e

# Upsert sample products into MongoDB running in the 'mongo' container
# Modify or extend the PRODUCTS array as needed
PRODUCTS='[
  { name: "Acme T-Shirt", description: "Comfortable cotton t-shirt.", price: 12.99, categories: ["clothing","men"] },
  { name: "Acme Sneakers", description: "Lightweight running shoes.", price: 59.99, categories: ["footwear"] },
  { name: "Acme Headphones", description: "Noise isolating headphones.", price: 89.99, categories: ["electronics","audio"] },
  { name: "Acme Jacket", description: "Waterproof jacket.", price: 79.99, categories: ["clothing","outerwear"] },
  { name: "Acme Jeans", description: "Slim fit jeans.", price: 39.99, categories: ["clothing"] },
  { name: "Acme Watch", description: "Quartz wristwatch.", price: 129.99, categories: ["accessories"] },
  { name: "Acme Backpack", description: "Durable travel backpack.", price: 49.99, categories: ["bags"] },
  { name: "Acme Sunglasses", description: "Polarized sunglasses.", price: 24.99, categories: ["accessories"] },
  { name: "Acme Coffee Mug", description: "Ceramic mug.", price: 9.99, categories: ["home"] },
  { name: "Acme Lamp", description: "Desk lamp with LED.", price: 29.99, categories: ["home","lighting"] },
  { name: "Acme Keyboard", description: "Mechanical keyboard.", price: 69.99, categories: ["electronics"] },
  { name: "Acme Mouse", description: "Wireless mouse.", price: 19.99, categories: ["electronics"] }
]'

echo "Seeding products into MongoDB..."

docker exec -i mongo bash -lc "mongo ecom --eval \"var products = $PRODUCTS; products.forEach(function(p){ db.products.updateOne({name: p.name}, { $set: p }, { upsert: true }); });\""

echo "Products seeded."