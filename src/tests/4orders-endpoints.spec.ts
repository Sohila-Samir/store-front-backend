import supertest from 'supertest';
import { orderTotalPaymentType, orderType } from '../models/order';
import app from '../server';

const request = supertest(app);
/*-------------------------------------------------------*/
describe('tests the orders endpoints', () => {
    it('tests the POST /orders endpoint to create a new order', async () => {
        const newOrderBody = {
            user_id: 3,
            status: 'active'
        } as orderType;
        const response = await request.post('/orders')
        .send(newOrderBody);
        expect(response.body).toEqual({
            id: 2,
            user_id: '3',
            status: 'active'
        } as orderType);
    });
    /*----------------------------------------------------------------------------------------------*/
    it('tests the GET /orders/:id enpoint to get a certain order', async () => {
        const response = await request.get('/orders/2')
        .set('Authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoVXNlciI6IlNpZ25lZCBJbiBzdWNjZXNzZnVsbHkgOikiLCJpYXQiOjE2NDYxNDM1NDN9.07sVO2Z_DV7ty4z-mp2wV6Jv-D1KusX6q1aeS_S8iTw');
        expect(response.body).toEqual({
            id: 2,
            user_id: '3',
            status: 'active'
        } as orderType);
    });
    /*-----------------------------------------------------------------------------------------------*/
    it('tests the GET /orders endpoint to get all orders in the order_header table', async () => {
        const response = await request.get('/orders')
        .set('Authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoVXNlciI6IlNpZ25lZCBJbiBzdWNjZXNzZnVsbHkgOikiLCJpYXQiOjE2NDYxNDM1NDN9.07sVO2Z_DV7ty4z-mp2wV6Jv-D1KusX6q1aeS_S8iTw');
        expect(response.body.length).toBeTrue;
        expect(response.body).toContain({
            id: 2,
            user_id: '3',
            status: 'active'
        } as orderType);
    });
    /*-----------------------------------------------------------------------------------------------*/
    it('tests the PUT /order/:id endpoint to update an existing row and return it', async () => {
        const updatedOrderBody = {
            column: 'status',
            new_value: 'complete',
        };
        const response = await request.put('/orders/2')
        .set('Authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoVXNlciI6IlNpZ25lZCBJbiBzdWNjZXNzZnVsbHkgOikiLCJpYXQiOjE2NDYxNDM1NDN9.07sVO2Z_DV7ty4z-mp2wV6Jv-D1KusX6q1aeS_S8iTw')
        .send(updatedOrderBody);
        expect(response.body).toEqual({
            id: 2,
            user_id: '3',
            status: 'complete'
        });
    });
    /*-----------------------------------------------------------------------------------------------*/
    it('tests the GET /order/:status/users/:uid', async () => {
        const activeResponse = await request.put('/order/active/users/3')
        .set('Authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoVXNlciI6IlNpZ25lZCBJbiBzdWNjZXNzZnVsbHkgOikiLCJpYXQiOjE2NDYxNDM1NDN9.07sVO2Z_DV7ty4z-mp2wV6Jv-D1KusX6q1aeS_S8iTw');
        //////////////////////////////////////////////////////////////////////////////////
        const completeResponse = await request.put('/order/complete/users/3')
        .set('Authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoVXNlciI6IlNpZ25lZCBJbiBzdWNjZXNzZnVsbHkgOikiLCJpYXQiOjE2NDYxNDM1NDN9.07sVO2Z_DV7ty4z-mp2wV6Jv-D1KusX6q1aeS_S8iTw');
        expect(activeResponse.body).not.toEqual('There is no Active orders to user 3');
        expect(completeResponse.body).not.toEqual('There is no Complete orders to user 3');
    });
    /*-----------------------------------------------------------------------------------------------*/
    it('tests the GET /orders/:id/total-payment endpoint to get the sum of all products prices related to the given order', async () => {
        await request.post('/orders/2/products')
        .send({
            product_id: 1,
            qty: 1,
        });
        const response = await request.get('/orders/2/total-payment')
        .set('Authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoVXNlciI6IlNpZ25lZCBJbiBzdWNjZXNzZnVsbHkgOikiLCJpYXQiOjE2NDYxNDM1NDN9.07sVO2Z_DV7ty4z-mp2wV6Jv-D1KusX6q1aeS_S8iTw');
        expect(response.body).toEqual({
            total_payment: '23000'
        } as orderTotalPaymentType);
    });
    /*-----------------------------------------------------------------------------------------------*/
    it('tests the DELETE /orders/:id endpoint to delete an existing row and return it', async () => {
        await request.delete('/orders/2/products/2')
        .set('Authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoVXNlciI6IlNpZ25lZCBJbiBzdWNjZXNzZnVsbHkgOikiLCJpYXQiOjE2NDYxNDM1NDN9.07sVO2Z_DV7ty4z-mp2wV6Jv-D1KusX6q1aeS_S8iTw');
        //////////////////////////////////////////////////////////////////////////////////
        const response = await request.delete('/orders/2')
        .set('Authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoVXNlciI6IlNpZ25lZCBJbiBzdWNjZXNzZnVsbHkgOikiLCJpYXQiOjE2NDYxNDM1NDN9.07sVO2Z_DV7ty4z-mp2wV6Jv-D1KusX6q1aeS_S8iTw');
        expect(response.body).toEqual({
            id: 2,
            user_id: '3',
            status: 'complete'
        });
    });
    /*-----------------------------------------------------------------------------------------------*/
});