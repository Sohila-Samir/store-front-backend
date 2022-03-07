import supertest from 'supertest';
import app from '../server.js';

const request = supertest(app);

describe('tests the dashboard service file endpoints', () => {
    it('tests the GET /services/top-5-products', async () => {
        const response = await request.get('/services/top-5-products');
        expect(response.body).not.toThrowError;
        expect(response.body).not.toEqual('Oops! seems like there is no products orderd yet :(');
    });
});