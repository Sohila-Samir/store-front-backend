CREATE TABLE order_header (id SERIAL PRIMARY KEY,
                                             user_id BIGINT REFERENCES users(id),
                                                                       status VARCHAR(20));