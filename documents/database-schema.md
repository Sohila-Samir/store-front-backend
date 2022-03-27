# Database schema
## Table of contents:
- [Databases](#databases)
- [Tables](#tables)
- [Data shapes](#data-shapes)

## Databases:
1. store_front for **Development**
2. store_front_test for **Testing**

## Tables:
- **users** - (for storing users).
- **products** - (for storing products).
- **order_header** - (for storing orders).
- **order_details** - (join table between products and order_header tables, for storing order products).

## Data shapes:
### users:
- **id** - SERIAL PRIMARY KEY
- **first_name** - VARCHAR(100)
- **last_name** - VARCHAR(100)
- **password** - VARCHAR(200)
### products:
- **id** - SERIAL PRIMARY KEY
- **name** - VARCHAR(80) NOT NULL
- **price** - VARCHAR(6) NOT NULL
- **category** - VARCHAR(100) NOT NULL
- **color** - VARCHAR(30)
- **description** - TEXT
### order_header:
- **id** - SERIAL PRIMARY KEY
- **user_id** - BIGINT REFERENCES users(id)
- **status** - VARCHAR(20)
### order_details:
- **id** - SERIAL PRIMARY KEY
- **Order_id** - BIGINT REFERENCES Order_header(id)
- **Product_id** - BIGINT REFERENCES products(id)
- **qty - SMALLINT**
- **product_Price** - INT
- **sub_total** - INT

> Both databases are runing on the default port number (5432).
