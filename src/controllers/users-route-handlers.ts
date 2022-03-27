import { Request, Response } from 'express';
import { User } from '../models/user';
import { userType } from '../models/user';
import  jwt  from 'jsonwebtoken';
import express from 'express';
import { authenticateToken as authenticateToken } from '../modules/authenticate';
/*-------------------------------------END OF SETUP FOR WORKING ON USERS CLASS METHODS HANDLERS---------------------------------*/
//initializing a new instance of the users class
const user = new User;
//get the secret signature from the env variables
const secretSignature = process.env.SECRET_SIGNATURE as string;
/*------------------------------------------------------------------------------------------------*/
//get all users
const getAllUsersHandler = async (req: Request, res: Response): Promise<void>  => {
    try {
        const allUserRecords = await user.index();
        res.json(allUserRecords);
    }catch(err: unknown) {
        res.status(401);
        res.json(`an error was caught during getting all users ${err}`);
    }
};
/*----------------------------------------------------------------------------------------*/
//get a certain user
const getUserHandler = async (req: Request, res: Response): Promise<void>  => {
    try {
        const userRecord = await user.showUser(parseInt(req.params.uid));
        res.json(userRecord);
    }catch(err: unknown) {
        res.status(401);
        res.json(`an error was caught during getting all users ${err}`);
    }
};
/*----------------------------------------------------------------------------------------*/
//add a new user and send back a jwt token
const createNewUserHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const newUser =  {
            first_name: req.body.first_name as string,
            last_name: req.body.last_name as string,
            password: req.body.password as string
        };
        const result = await user.newUser(newUser as userType) as userType ;
        const token = jwt.sign({user: result}, secretSignature);
        res.json(token);
    }catch(err: unknown) {
        res.status(401);
        res.send(`could not create new user account ${err}`);
    }
};
/*----------------------------------------------------------------------------------------*/
//authenticate user based on existing first_name, last_name and correct password
const authenticateUserHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const userData = {
            first_name: req.body.first_name as string,
            last_name: req.body.last_name as string,
            password: req.body.password as string
        };
        const result = await user.authenticate(userData.first_name, userData.last_name, userData.password) as string;
        if (result === 'Incorrect Password! :(') {
            res.json(result);

        } else {
            const token = jwt.sign({authUser: result}, secretSignature) as string;
            res.json({
                message: result,
                token,
            });
        }
    }catch(err: unknown) {
        res.status(401);
        res.json('Incorrect inputs!');
    }
};
/*---------------------------------------------------------------------------------------------------------------------------------*/
//delete a certain user
const destroyUserHandler = async (req: Request, res: Response): Promise<void> => {
    try{
        const result = await user.destroyUser(req.body.first_name, req.body.last_name, req.body.password, req.params.uid);
        res.json(result);
    }catch(err: unknown) {
        res.status(401);
        res.json(`${err}`);
    }
};
/*---------------------------------------------------------------------------------------------------------------------------------*/
//update requested user info however in case of the requested column is password make sure to validate the current password first.
const updateUserInfoHandler = async (req: Request, res: Response): Promise<void> => {
    try{
        const result = await user.updateUserInfo(req.body.column, req.body.new_value, req.params.uid, req.body.current_password,);
        res.json(result);
    }catch(err: unknown) {
        res.status(401);
        res.json(`an error occurred during requesting to update user info ${err}`);
    }
};
/*---------------------------------------------------------------------------------------------------------------------------------*/

//creating restful routes for the user routes handlers
export const userRoutes = (app: express.Application) => {
    app.get('/users', authenticateToken ,getAllUsersHandler);
    app.get('/users/:uid',authenticateToken, getUserHandler);//uid >> user id
    app.post('/users', createNewUserHandler);
    app.post('/users/auth', authenticateUserHandler);
    app.put('/users/:uid', authenticateToken, updateUserInfoHandler);//uid >> user id
    app.delete('/users/:uid',authenticateToken, destroyUserHandler);//uid >> user id
};