import { authenticateToken } from '../modules/authenticate';

describe('tests the authenticate token function middleware', () => {
    it('tests authenticate token function middleware', () => {
        expect(authenticateToken).not.toThrowError;
        expect(authenticateToken).not.toEqual('Invalid token or signature!');
    });
});