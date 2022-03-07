import { User } from '../models/user';

describe('tests the user module', () => {
    const user = new User();
    it('tests if newUser method creats a new user in the users table', async () => {
        const result = await user.newUser({
            first_name: 'Nathan',
            last_name: 'Rozentals',
            password: 'password123'
        });
        expect(result).toEqual({
            id: 1 as number,
            first_name: 'Nathan',
            last_name: 'Rozentals',
            password: result.password as string
        });
    });
    /*---------------------------------------------------------------------------------------------------------------------------------*/
    it('tests if index method will return all users/customers', async () => {
        const getAllUsers = await user.index();
        expect(getAllUsers.length > 0).toBeTruthy;
    });
    /*---------------------------------------------------------------------------------------------------------------------------------*/
    it('tests if showUser method will return a certain user', async () => {
        const getUser = await user.showUser(1);
        expect(getUser).toEqual({
            id: 1 as number,
            first_name: 'Nathan',
            last_name: 'Rozentals',
            password: getUser.password as string
        });
    });
    /*---------------------------------------------------------------------------------------------------------------------------------*/
    it('tests if the authnticate method authnticate user via password', async () => {
        const correctReq = await user.authunticate('Nathan','Rozentals','password123');
        expect(correctReq).toEqual('Signed In successfully :)');
        const wrongReq = await user.authunticate('Nathan','Rozentals','password1236');
        expect(wrongReq).toEqual('Incorrect Password! :(');
    });
    /*---------------------------------------------------------------------------------------------------------------------------------*/
    describe('tests the custom error messages for the destroyUser method', () => {
        it('tests if it will return the error message if password is incorrect', async () => {
            const wrongDestroyPassword = await user.destroyUser('Nathan','Rozentals','password123-WRONG', '1');
            expect(wrongDestroyPassword).toEqual('incorrect password, please check your password again.');
        });
        /*---------------------------------------------------------------------------------------------------------------------------------*/
        it('tests if it will return the error message when last_name is not correct', async () => {
            const wrongDestroyFirstName = await user.destroyUser('Nathan','Rozentals-WRONG','password123', '1');
            expect(wrongDestroyFirstName).toEqual('user not found! please check your first and last name again. or sign up first if not');
        });
        /*---------------------------------------------------------------------------------------------------------------------------------*/
        it('tests if it will return the error message if first_name is incorrect.', async () => {
            const wrongDestroyLastName = await user.destroyUser('Nathan-WRONG','Rozentals','password123', '1');
            expect(wrongDestroyLastName).toEqual('user not found! please check your first and last name again. or sign up first if not');
        });
        /*---------------------------------------------------------------------------------------------------------------------------------*/
    });
    /*---------------------------------------------------------------------------------------------------------------------------------*/
    /*---------------------------------------------------------------------------------------------------------------------------------*/
    it('tests if destroyUser method will delete the given user record with the correct inputs and return the deleted record', async () =>  {
        const destroyUserRecord = await user.destroyUser('Nathan', 'Rozentals', 'password123', '1');
        expect(destroyUserRecord).not.toThrowError;
        expect(destroyUserRecord).toBeDefined;
    });
    /*---------------------------------------------------------------------------------------------------------------------------------*/
});