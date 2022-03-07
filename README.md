# store-front-backend
  ## Introduction
  - simply this is a basic e-commerce backend project. by using the following technologies:
    1. node.js and express for backend logic & creating restful routes.
    2. jasmine and supertest for integration and unit testing.
    3. PostgresSQL for manipulating data.
    4. TypeScript instead of JavaScript for imposing strict type checks.
    5. Eslint and prettier for imposing more cleaner code.

  ## used dependencies and devDependencies
   ### dependencies:
    "@types/bcrypt": "^5.0.0",
    "bcrypt": "^5.0.1",
    "body-parser": "^1.19.2",
    "cors": "^2.8.5",
    "db-migrate": "^0.11.13",
    "db-migrate-pg": "^1.2.2",
    "dotenv": "^16.0.0",
    "express": "^4.17.3",
    "fs": "0.0.1-security",
    "jasmine": "^4.0.2",
    "pg": "^8.7.3",
    "supertest": "^6.2.2"
   ### devDpendencies:
    "@types/body-parser": "^1.19.2",
    "@types/cors": "^2.8.12",
    "@types/express": "^4.17.13",
    "@types/jasmine": "^3.10.3",
    "@types/jsonwebtoken": "^8.5.8",
    "@types/node": "^17.0.18",
    "@types/pg": "^8.6.4",
    "@types/prettier": "^2.4.4",
    "@types/supertest": "^2.0.11",
    "@typescript-eslint/eslint-plugin": "^5.12.0",
    "@typescript-eslint/parser": "^5.12.0",
    "eslint": "^8.9.0",
    "eslint-config-prettier": "^8.4.0",
    "eslint-plugin-prettier": "^4.0.0",
    "jasmine-spec-reporter": "^7.0.0",
    "jsonwebtoken": "^8.5.1",
    "nodemon": "^2.0.15",
    "prettier": "^2.5.1",
    "ts-node": "^10.5.0",
    "typescript": "^4.5.5"
  ## server port
   - 2147
  ## Instructions for runing the project
   - you will need to install the dependencies and devdpendencies using `npm install` command.
   - make sure to follow the following database scheme:
     ### database schema
     #### Databases:
      1. store_front for **Devlopment**
      2. store_front_test for **Testsing**
     #### Tables:
      1. users - for storing users.
      2. products - for storing products.
      3. order_header - for storing orders.
      4. order_details - join table between products and order_header tables, for storing order products.
     #### Data shapes:
     ##### users:
     - id - SERIAL PRIMARY KEY
     - first_name - VARCHAR(100)
     - last_name - VARCHAR(100)
     - password - VARCHAR(200)
     ##### products:
     - id - SERIAL PRIMARY KEY
     - name - VARCHAR(80) NOT NULL
     - price - VARCHAR(6) NOT NULL
     - category - VARCHAR(100) NOT NULL
     - color - VARCHAR(30)
     - description - TEXT
     ##### order_header:
     - id - SERIAL PRIMARY KEY
     - user_id - BIGINT REFERENCES users(id)
     - status - VARCHAR(20)
     ##### order_details:
     - id - SERIAL PRIMARY KEY
     - Order_id - BIGINT REFERENCES Order_header(id)
     - Product_id - BIGINT REFERENCES products(id)
     - qty - SMALLINT
     - product_Price - INT
     - sub_total - INT
     ### Environment variables:
     - POSTGRES_HOST=localhost
     - POSTGRES_USER=sto
     - POSTGRES_PASSWORD=password123
     - POSTGRES_DB=store_front
     - POSTGRES_DB_TEST=store_front_test
     - ENV=dev
     - BCRYPT_PASSWORD=how-deep-is-your-love789
     - SALT_ROUNDS=10
     - SECRET_SIGNTURE=tfvbhyg789654123
     ### how to start the project:
     #### for development:
      1. run [db-migrate up -c 4] - in order to add all the tables listed above.
      2. run [npm run build] - compile the ts files to js.
      3. run [node /dist/server.ts] - start the server.
     #### for testing:
      1. only run [npm run all] - will compile ts files, run eslint & prettier, add migrations to the test db and run jasmine.
   > And you should be good to go from here.
  ## Endpoints used in the project:
   ### Users:
  - POST /users - creting new user.
  - POST /users/auth - authnticating user.
  - GET /users/:uid - show a certain user.
  - GET /users - show all users.
  - PUT /users/:uid - update user info
  - DELETE /users:id - delete a certain user.
   ### Orders:
  - POST /orders - create a new order.
  - GET /orders - get all orders.
  - GET /orders/:id - get a certain order.
  - PUT /orders/:id - update a certain column in a certain order.
  - DELETE /orders/:id - delete a certain order.
  - GET /orders/:id/total-payment - get the total payment of all products that has been included in a certain order.
  - GET /orders/:status/users/:uid - get only either all "active" or "complete" orders for a certain user.
  > uid = user id & status can only be "active" or "complete".
   ### Products:
  - POST /products - create a new product.
  - GET /products - get all products.
  - GET /products/:id - get a certain product.
  - GET /products/categories/:category - get all products that matches the specified category.
  - PUT /products/:id - update a certain column in with a certain new value in a certain product.
  - DELETE /products/:id - delete a certain product.
  - POST /orders/:id/products - add a product to an existing order.
  - GET /orders/:id/products - get all products that have been included to a certain order.
  - GET /orders/products - get all products that have been included in orders.
  - PUT /orders/:id/products/:opid - update a certain column with a certain value to a certain existing op related a certain existing order.
  > op = order product.
  - DELETE /orders/:id/products/:opid - delete a certain existing product from a certain existing order.
  ### Dashboard services:
  - GET /services/top-5-products - get the top/frequently added products to orders.