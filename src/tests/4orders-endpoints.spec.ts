import supertest from 'supertest';
import { orderTotalPaymentType, orderType } from '../models/order';
import app from '../server';
import  jwt  from 'jsonwebtoken';

const request = supertest(app);
const secretSignature = process.env.SECRET_SIGNATURE as string;
/*------------------------------------------------------------------------------------------------------------------------*/
describe('tests the orders endpoints', () => {
    //creating a new jwt for each time an endpoint testing run that requires jwt authentication.
    const jwtToken = jwt.sign('just for testing on endpoints', secretSignature);
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
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
    it('tests the GET /orders/:id endpoint to get a certain order', async () => {
        const response = await request.get('/orders/2')
        .set('Authorization',`bearer ${jwtToken}`);
        expect(response.body).toEqual({
            id: 2,
            user_id: '3',
            status: 'active'
        } as orderType);
    });
    /*-----------------------------------------------------------------------------------------------*/
    it('tests the GET /orders endpoint to get all orders in the order_header table', async () => {
        const response = await request.get('/orders')
        .set('Authorization',`bearer ${jwtToken}`);
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
        .set('Authorization',`bearer ${jwtToken}`)
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
        .set('Authorization',`bearer ${jwtToken}`);
        //////////////////////////////////////////////////////////////////////////////////
        const completeResponse = await request.put('/order/complete/users/3')
        .set('Authorization',`bearer ${jwtToken}`);
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
        .set('Authorization',`bearer ${jwtToken}`);
        expect(response.body).toEqual({
            total_payment: '23000'
        } as orderTotalPaymentType);
    });
    /*-----------------------------------------------------------------------------------------------*/
    it('tests the DELETE /orders/:id endpoint to delete an existing row and return it', async () => {
        await request.delete('/orders/2/products/2')
        .set('Authorization',`bearer ${jwtToken}`);
        //////////////////////////////////////////////////////////////////////////////////
        const response = await request.delete('/orders/2')
        .set('Authorization',`bearer ${jwtToken}`);
        expect(response.body).toEqual({
            id: 2,
            user_id: '3',
            status: 'complete'
        });
    });
    /*-----------------------------------------------------------------------------------------------*/
});