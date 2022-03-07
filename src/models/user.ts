import { QueryResult } from 'pg';
import client  from '../database';
import bcrypt from 'bcrypt';

//creating necessary types for the returned data from the users class methods
export type userType = {
    id?: number,
    first_name: string,
    last_name: string
    password: string
}
export type deletedUserType = {
    message: string,
    record?: userType
}
/*------------------------------------------------------------------------------------------------------------------------------------*/
//extratcing the pepper secret phrase and salt rounds number from the env variables
const pepper = process.env.BCRYPT_PASSWORD as string;
const saltRounds= parseInt(process.env.SALT_ROUNDS as string) as number;

export class User {
    //get all users
    async index (): Promise<userType[]> {
        try {
            const connect = await client.connect();
            const qry ='SELECT * FROM users';
            const getUsers = await connect.query(qry,);
            const users = getUsers.rows;
            connect.release();
            return users;
        }catch(err: unknown) {
        throw new Error(`an error occured during getting all users : ${err}`);
        }
    }
    /*------------------------------------------------------------------------------------------------------------------------------------*/
    //show a certain user
    async showUser (id: number): Promise<userType> {
        try {
            const connect = await client.connect();
            const qry ='SELECT * FROM users WHERE id = $1';
            const getUser = await connect.query(qry, [id]);
            const user = getUser.rows[0];
            connect.release();
            return user;
        }catch(err: unknown) {
            throw new Error(`an error occured during getting the user : ${err}`);
        }
    }
    /*------------------------------------------------------------------------------------------------------------------------------------*/
    //create a new user with a hashed password
    async newUser (user: userType): Promise<userType> {
        try {
            const connect = await client.connect();
            const qry = 'INSERT INTO users (first_name, last_name, password) VALUES($1, $2, $3) RETURNING *' as string;
            //hash the given password before saving it in the database.
            const hash = bcrypt.hashSync(user.password + pepper , saltRounds) as string;
            //saving the new user in the database with the hashed password and other user infos.
            const result = await connect.query(qry, [user.first_name, user.last_name, hash]) as QueryResult<userType>;
            connect.release();
            return result.rows[0];
        }catch(err: unknown) {
            throw new Error(`an error occured during creating an account for: ${err}`);
        }
    }
    /*------------------------------------------------------------------------------------------------------------------------------------*/
    //authnticate a user based on correct password
    async authunticate (firstName: string, LastName: string, password: string): Promise<string> {
        const connect = await client.connect();
        const qry = 'SELECT password FROM users WHERE first_name = $1 AND Last_name = $2';
        const userDataResult = await connect.query(qry, [firstName, LastName]);
        const realUserPassword = userDataResult.rows[0].password as string;
        const givenUserPassword = password + pepper as string;
        if(bcrypt.compareSync(givenUserPassword ,realUserPassword )) {
            return 'Signed In successfully :)' as string;
        }
        connect.release();
        return 'Incorrect Password! :(' as string;
    }

    /*------------------------------------------------------------------------------------------------------------------------------------*/
    //updating any user info however if the column requested to be updated is passsword. current password should be validated first.
    async updateUserInfo (column: string, newValue: string, userId: string, currentPassword?: string): Promise<userType | string> {
        const connect = await client.connect();
        const updateUserInfoQry = `UPDATE users SET ${column} = $1 WHERE id = $2 RETURNING *`;
        //incase the column requested to be updated is password, make sure to validate the current password first
        if(column === 'password') {
            //add pepper to the current password so i can compare it with the real password
            const givenUserPassword = currentPassword + pepper as string;
            // get the real password of the user from the database
            const getRealUserPasswordQry = 'SELECT password FROM users WHERE id = $1';
            const getRealUserPassword = await connect.query(getRealUserPasswordQry, [userId]) as QueryResult;
            const realUserPassword = getRealUserPassword.rows[0].password as string;
            //compare the given password and the real current password and if not matched inform the user to check the given password again
            if(!bcrypt.compareSync(givenUserPassword, realUserPassword)) {
                return 'Wrong password, Please make sure to provide the correct current password.';
            }
            //incase the two password matches hash the given password then update the real password with the given password in the database
            const hashGivenPassword = bcrypt.hashSync(newValue + pepper, saltRounds) as string;
            const updateUserPassword = await connect.query(updateUserInfoQry, [hashGivenPassword, userId]) as QueryResult;
            return updateUserPassword.rows[0] as userType;
        }
        //incase the requested column to be updated is not password update it and return backk
        const updateUserInfo = await connect.query(updateUserInfoQry, [newValue, userId]) as QueryResult;
        return updateUserInfo.rowCount as number?updateUserInfo.rows[0] as userType:`looks like input ${column} was not updated :(`;
    }
    /*------------------------------------------------------------------------------------------------------------------------------------*/

    //delete a certain user based on existing given first and last name in db and correct password provided.
    async destroyUser (givenFirstName: string, givenLastName: string, password: string, userId: string): Promise<deletedUserType | string> {
        //getting the first and last name first based on the given last and first name in order to check if they exist or not.
        const connect = await client.connect();
        const getFirstAndLastNameQry = 'SELECT first_name, last_name FROM users WHERE first_name = $1 AND Last_name = $2 AND id = $3';
        const getFirstAndLastName = await connect.query(getFirstAndLastNameQry, [givenFirstName, givenLastName, userId]) as QueryResult;
        //if last and first names exist in the database, hash the given password and compare it the password saved in db related to the user.
        if(getFirstAndLastName.rowCount) {
            //get the password saved in database related to the given first and last names.
            const getUserPasswordQry = 'SELECT password FROM users WHERE first_name = $1 AND Last_name = $2 AND id = $3';
            const getUserPassword = await connect.query(getUserPasswordQry, [givenFirstName, givenLastName, userId]) as QueryResult;
            const dbUserPassword = getUserPassword.rows[0].password as string;
            //hash the given password from the client side.
            const hashGivenPassword = password + pepper as string;
            //compare the given password with the saved database password.
            //if password is correct go and delete the user from the database and return the deleted user along with a successful message.
            if (bcrypt.compareSync(hashGivenPassword, dbUserPassword)) {
            const destroyUserRecordQry = 'DELETE FROM users WHERE first_name = $1 AND last_name = $2 AND id = $3 RETURNING *';
            const destroyUserRecord = await connect.query(destroyUserRecordQry, [givenFirstName, givenLastName, userId]) as QueryResult;
            const destroiedRecord = destroyUserRecord.rows[0] as userType;
            return {
                message: 'user found',
                record: destroiedRecord,
            } as deletedUserType;
        }
        //if password did not match. return an incorrect passord message to the user.
        return 'incorrect password, please check your password again.';
        }
        connect.release();
        //if the given first and last names did not match any existing user in the database, inform the user to check the inputs again or sign up
        return 'user not found! please check your first and last name again. or sign up first if not';
    }
    /*------------------------------------------------------------------------------------------------------------------------------------*/
}
