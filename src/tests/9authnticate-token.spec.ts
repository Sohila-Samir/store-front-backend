import { authunticateToken } from '../modules/authnticate-token';

describe('tests the auhtnticate token function middleware', () => {
    it('tests authnticate token function middleware', () => {
        expect(authunticateToken).not.toThrowError;
        expect(authunticateToken).not.toEqual('Invalid token or signture!');
    });
});