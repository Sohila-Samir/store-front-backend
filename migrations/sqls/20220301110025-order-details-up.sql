CREATE TABLE order_details (id SERIAL PRIMARY KEY,
                                              Order_id BIGINT REFERENCES Order_header(id),
                                                                         Product_id BIGINT REFERENCES products(id),
                                                                                                      qty SMALLINT, product_Price INT, sub_total INT);