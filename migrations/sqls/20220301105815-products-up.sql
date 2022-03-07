CREATE TABLE products(id SERIAL PRIMARY KEY,
                                        name VARCHAR(80) NOT NULL,
                                                         price VARCHAR(6) NOT NULL,
                                                                          category VARCHAR(100) NOT NULL,
                                                                                                color VARCHAR(30),
                                                                                                      description TEXT);
