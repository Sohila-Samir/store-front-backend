import supertest from 'supertest';
import app from '../server.js';

const request = supertest(app);
describe('tests all products endpoints', () => {
    it('tests the POST /products endpoint to create a new product', async () => {
        const response = await request.post('/products')
        .set('Authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoVXNlciI6IlNpZ25lZCBJbiBzdWNjZXNzZnVsbHkgOikiLCJpYXQiOjE2NDYxNDM1NDN9.07sVO2Z_DV7ty4z-mp2wV6Jv-D1KusX6q1aeS_S8iTw')
        .send({
            name: 'Digestin',
            price: '16',
            category: 'Medicine-Pills',
            color: null,
            description: null
        });
        expect(response.status).toBe(200);
        expect(response).not.toThrowError;
        expect(response.body).toEqual({
            id: 3,
            name: 'Digestin',
            price: '16',
            category: 'Medicine-Pills',
            color: null,
            description: null
        });
    });
    /*---------------------------------------------------------------------------------------------------------------------------------*/
    it('tests the GET /products endpoint to return all product records', async () => {
        const response = await request.get('/products');
        expect(response.status).toBe(200);
        expect(response).not.toThrowError;
        expect(response.body.length > 0).toBeTrue;
    });
    /*---------------------------------------------------------------------------------------------------------------------------------*/
    it('tests the GET /products/:id endpoint to return a certain product', async () => {
        const response = await request.get('/products/3');
        expect(response.status).toBe(200);
        expect(response).not.toThrowError;
        expect(response.body).toEqual({
            id: 3,
            name: 'Digestin',
            price: '16',
            category: 'Medicine-Pills',
            color: null,
            description: null
        });
    });
    /*---------------------------------------------------------------------------------------------------------------------------------*/
    it('tests the PUT /products/:id will change a certain column in a certain row and return the record that changes has been done to', async () => {
        const response = await request.put('/products/3')
        .set('Authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoVXNlciI6IlNpZ25lZCBJbiBzdWNjZXNzZnVsbHkgOikiLCJpYXQiOjE2NDYxNDM1NDN9.07sVO2Z_DV7ty4z-mp2wV6Jv-D1KusX6q1aeS_S8iTw')
        .send({
            column: 'price',
            new_value: 20,
        });
        expect(response.status).toBe(200);
        expect(response).not.toThrowError;
        expect(response.body).toEqual({
            id: 3,
            name: 'Digestin',
            price: '20',
            category: 'Medicine-Pills',
            color: null,
            description: null
        });
    });
    it('tests the GET /products/categories/:category to select products by category', async () => {
        const response = await request.get('/products/categories/Medicine-Pills')
        .set('Authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoVXNlciI6IlNpZ25lZCBJbiBzdWNjZXNzZnVsbHkgOikiLCJpYXQiOjE2NDYxNDM1NDN9.07sVO2Z_DV7ty4z-mp2wV6Jv-D1KusX6q1aeS_S8iTw');
        expect(response.body).not.toEqual('There is no products in Medicine-Pills');
        expect(response.body).not.toThrowError;
    });
    /*--------------------------------------------------------------------------------------------------------------------*/
                                        //END OF TESTS FOR CRUD MTHODS FOR PRODUCTS TABLE//
    /*--------------------------------------------------------------------------------------------------------------------*/
    describe('tests the orderProduct endpoints', () => {
        it('tests the POST /orders/:id/products endpoint to add a product to an order', async () => {
            const addProuctToOrders = await request.post('/orders/3/products')
            .send({
                product_id: 3,
                qty: 1,
            });
            expect(addProuctToOrders.body).toEqual({
                id: 4,
                order_id: '3',
                product_id: '3',
                qty: 1,
                product_price: 20,
                sub_total: 20
            });
        });
        /*----------------------------------------------------------------------------------------------------------------------*/
        it('tests the PUT /orders/:id/products/:opid endpoint to update a specific column in a specific order in a specific product', async () => {
            const updateOrderProduct = await request.put('/orders/3/products/4')
            .set('Authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoVXNlciI6IlNpZ25lZCBJbiBzdWNjZXNzZnVsbHkgOikiLCJpYXQiOjE2NDYxNDM1NDN9.07sVO2Z_DV7ty4z-mp2wV6Jv-D1KusX6q1aeS_S8iTw')
            .send({
                column: 'qty',
                new_value: 2
            });
            expect(updateOrderProduct.body).toEqual({
                id: 4,
                order_id: '3',
                product_id: '3',
                qty: 2,
                product_price: 20,
                sub_total: 40
            });
        });
        /*----------------------------------------------------------------------------------------------------------------------*/
        it('tests the GET /orders/:id/products endpoint to get all products in an order', async () => {
            const showAllOrderProducts = await request.get('/orders/3/products')
            .set('Authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoVXNlciI6IlNpZ25lZCBJbiBzdWNjZXNzZnVsbHkgOikiLCJpYXQiOjE2NDYxNDM1NDN9.07sVO2Z_DV7ty4z-mp2wV6Jv-D1KusX6q1aeS_S8iTw');
            expect(showAllOrderProducts.body).not.toEqual('seems like there is no products in order 3 in the orders list');
            expect(showAllOrderProducts.body).not.toThrowError;
        });
        /*----------------------------------------------------------------------------------------------------------------------*/
        it('tests the GET /orders/products endpoint to get all orders products', async () => {
            const getAllOrdersProducts = await request.get('/orders/products')
            .set('Authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoVXNlciI6IlNpZ25lZCBJbiBzdWNjZXNzZnVsbHkgOikiLCJpYXQiOjE2NDYxNDM1NDN9.07sVO2Z_DV7ty4z-mp2wV6Jv-D1KusX6q1aeS_S8iTw');
            expect(getAllOrdersProducts.body.length).toBeTrue;
            expect(getAllOrdersProducts.body).toBeDefined;
            expect(getAllOrdersProducts).not.toThrowError;
        });
        /*----------------------------------------------------------------------------------------------------------------------*/
        it('tests the DELETE /orders/:id/products/:opid endpoint to delete a specfic product from a specific order', async () => {
            const deleteOrderProduct = await request.delete('/orders/3/products/4')
            .set('Authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoVXNlciI6IlNpZ25lZCBJbiBzdWNjZXNzZnVsbHkgOikiLCJpYXQiOjE2NDYxNDM1NDN9.07sVO2Z_DV7ty4z-mp2wV6Jv-D1KusX6q1aeS_S8iTw');
            expect(deleteOrderProduct.body).toEqual({
                id: 4,
                order_id: '3',
                product_id: '3',
                qty: 2,
                product_price: 20,
                sub_total: 40
            });
        });
    });
    /*----------------------------------------------------------------------------------------------------------------------*/
                                        //END OF TESTING FOR ORDERPRODUCT CLASS//
    /*----------------------------------------------------------------------------------------------------------------------*/
    //NOTE: I ADDED THIS METHOD FROM THE PRODUCTCLASS AT THE END IN ORDER TO NOT CREATE ANOTER PRODUCT AGAIN FOR TESTING ON ORDER PRODUCTS ENDPOINTS
    it('tests the DELETE /products/:id delete a product and return the deleted record', async () => {
        const response = await request.delete('/products/3')
        .set('Authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoVXNlciI6IlNpZ25lZCBJbiBzdWNjZXNzZnVsbHkgOikiLCJpYXQiOjE2NDYxNDM1NDN9.07sVO2Z_DV7ty4z-mp2wV6Jv-D1KusX6q1aeS_S8iTw');
        expect(response.status).toBe(200);
        expect(response).not.toThrowError;
        expect(response.body).toEqual({
            id: 3,
            name: 'Digestin',
            price: '20',
            category: 'Medicine-Pills',
            color: null,
            description: null
        });
    });
});
