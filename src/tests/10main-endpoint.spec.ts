import app from '../server.js';
import supertest from 'supertest';

const request = supertest(app);

it('testing the root endpoint', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200 || 302);
});