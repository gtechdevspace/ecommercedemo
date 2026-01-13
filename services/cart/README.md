Cart service

Endpoints:
- GET /api/cart
- POST /api/cart/items { productId, quantity }
- PATCH /api/cart/items/:productId { quantity }
- DELETE /api/cart/items/:productId
- POST /api/cart/clear

Auth: requires Bearer token from Auth service