# Endpoints:
   ## Users:
  - `POST /users` - (creating new user).
  - `POST /users/auth` - (authenticating user).
  - `GET /users/:uid` - (show a certain user).
  - `GET /users` - (show all users).
  - `PUT /users/:uid` - (update user info)
  - `DELETE /users:id` - (delete a certain user).
   ## Orders:
  - `POST /orders` - (create a new order).
  - `GET /orders` - (get all orders).
  - `GET /orders/:id` - (get a certain order).
  - `PUT /orders/:id` - (update a certain column in a certain order).
  - `DELETE /orders/:id` - (delete a certain order).
  - `GET /orders/:id/total-payment` - (get the total payment of all products that has been included in a certain order).
  - `GET /orders/:status/users/:uid` - (get only either all "active" or "complete" orders for a certain user).
  > uid = user id & status can only be "active" or "complete".
   ## Products:
  - `POST /products` - (create a new product).
  - `GET /products` - (get all products).
  - `GET /products/:id` - (get a certain product).
  - `GET /products/categories/:category` - (get all products that matches the specified category).
  - `PUT /products/:id` - (update a certain column in with a certain new value in a certain product).
  - `DELETE /products/:id` - (delete a certain product).
  - `POST /orders/:id/products` - (add a product to an existing order).
  - `GET /orders/:id/products` - (get all products that have been included to a certain order).
  - `GET /orders/products` - (get all products that have been included in orders).
  - `PUT /orders/:id/products/:opid` - (update a certain column with a certain value to a certain existing op related a certain existing) order.
  - `DELETE /orders/:id/products/:opid` - (delete a certain existing product from a certain existing order).
  > op = order product.
  ## Dashboard services:
  - `GET /services/top-5-products` - (get the top/frequently added products to orders).