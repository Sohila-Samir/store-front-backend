import supertest from 'supertest';
import { deletedUserType, userType } from '../models/user.js';
import app from '../server.js';

const request = supertest(app);

describe('tests the users endpoints', () => {
    it('tests the POST /users endpoint to create a new user and give back a jwt token', async () => {
        const response = await request.post('/users')
        .send({
            first_name: 'Demi',
            last_name: 'Sinister',
            password: 'idk78654123'
        });
        expect(response.status).toBe(200);
        expect(response).not.toThrowError;
        expect(response.body).not.toBe({});
    });
    /*---------------------------------------------------------------------------------------------------------------------------------*/
    it('tests the GET /users endpoint return all users when providing a valid jwt', async () => {
        const response = await request.get('/users')
        .set('Authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoVXNlciI6IlNpZ25lZCBJbiBzdWNjZXNzZnVsbHkgOikiLCJpYXQiOjE2NDYxNDM1NDN9.07sVO2Z_DV7ty4z-mp2wV6Jv-D1KusX6q1aeS_S8iTw');
        expect(response.status).toBe(200);
        expect(response).not.toThrowError;
        expect(response.body).not.toBe({});
    });
    /*---------------------------------------------------------------------------------------------------------------------------------*/
    it('tests if GET /users/:id return a specific user', async () => {
        const response = await request.get('/users/2')
        .send({
            id: 2
        });
        expect(response.status).toBe(200);
        expect(response).not.toThrowError;
        expect(response.body).not.toBe({});
        expect(response.body).toEqual({
            id: 2,
            first_name: 'Demi',
            last_name: 'Sinister',
            password: response.body.password
        });
    });
    /*---------------------------------------------------------------------------------------------------------------------------------*/
    it('tests if POST /users/auth will generate the intended error messages if a incorrect password is given or not',
    async () => {
        const response = await request.post('/users/auth')
        .send({
            first_name: 'Demi',
            last_name: 'Sinister',
            password: 'idk78654123wrong'
        });
        expect(response.body).toEqual('Incorrect Password! :(');
    });
    /*---------------------------------------------------------------------------------------------------------------------------------*/
    it('tests if POST /users/auth will authnticate user only if password is correct and return back a token and a success message',
    async () => {
        const response = await request.post('/users/auth')
        .send({
            first_name: 'Demi',
            last_name: 'Sinister',
            password: 'idk78654123'
        });
        expect(response.status).toBe(200);
        expect(response).not.toThrowError;
        expect(response.body).not.toBe({});
        expect(response.body).toEqual({
            message: 'Signed In successfully :)',
            token: response.body.token
        });
    });
    /*---------------------------------------------------------------------------------------------------------------------------------*/
    describe('tests the custom error messages for the DELETE /users/:id', () => {
        it('tests if DELETE /users/:id will return the intended errors when input is incorrect or not', async () => {
            const wrongDestroyPassword = await request.delete('/users/2')
            .set('Authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoVXNlciI6IlNpZ25lZCBJbiBzdWNjZXNzZnVsbHkgOikiLCJpYXQiOjE2NDYxNDM1NDN9.07sVO2Z_DV7ty4z-mp2wV6Jv-D1KusX6q1aeS_S8iTw')
            .send({
                first_name: 'Demi',
                last_name: 'Sinister',
                password: 'idk78654123-WRONG'
            });
            expect(wrongDestroyPassword.body).toEqual('incorrect password, please check your password again.');
            /*---------------------------------------------------------------------------------------------------------------------------------*/
            const wrongDestroyFirstName = await request.delete('/users/2')
            .set('Authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoVXNlciI6IlNpZ25lZCBJbiBzdWNjZXNzZnVsbHkgOikiLCJpYXQiOjE2NDYxNDM1NDN9.07sVO2Z_DV7ty4z-mp2wV6Jv-D1KusX6q1aeS_S8iTw')
            .send({
                first_name: 'Demi-WRONG',
                last_name: 'Sinister',
                password: 'idk78654123'
            });
            expect(wrongDestroyFirstName.body).toEqual('user not found! please check your first and last name again. or sign up first if not');
            /*---------------------------------------------------------------------------------------------------------------------------------*/
            const wrongDestroyLastName = await request.delete('/users/2')
            .set('Authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoVXNlciI6IlNpZ25lZCBJbiBzdWNjZXNzZnVsbHkgOikiLCJpYXQiOjE2NDYxNDM1NDN9.07sVO2Z_DV7ty4z-mp2wV6Jv-D1KusX6q1aeS_S8iTw')
            .send({
                first_name: 'Demi',
                last_name: 'Sinister-WRONG',
                password: 'idk78654123'
            });
            expect(wrongDestroyLastName.body).toEqual('user not found! please check your first and last name again. or sign up first if not');
        });
    });
    /*---------------------------------------------------------------------------------------------------------------------------------*/
    it('tests if DELETE /users/:id will delete a user but only if all inputs are correct', async () => {
        const response = await request.delete('/users/2')
        .set('Authorization','bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoVXNlciI6IlNpZ25lZCBJbiBzdWNjZXNzZnVsbHkgOikiLCJpYXQiOjE2NDYxNDM1NDN9.07sVO2Z_DV7ty4z-mp2wV6Jv-D1KusX6q1aeS_S8iTw')
        .send({
            first_name: 'Demi',
            last_name: 'Sinister',
            password: 'idk78654123'
        });
        expect(response.status).toBe(200);
        expect(response).not.toThrowError;
        expect(response.body).not.toBe({});
        expect(response.body).toEqual({
            message: 'user found',
            record: {
                id: 2,
                first_name: 'Demi',
                last_name: 'Sinister',
                password: response.body.record.password
            } as userType
        }as deletedUserType);
    });
});
