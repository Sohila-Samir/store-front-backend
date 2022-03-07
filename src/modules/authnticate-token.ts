import jwt from 'jsonwebtoken';
import express from 'express';
/*------------------------------------------------------------------------------------------------------------------------------------*/
//middleware to check for a valid jwt token before making important database requests
export const authunticateToken = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    try {
        //get the secret signture required for generating a jwt token from env variables.
        const secretSignture = process.env.SECRET_SIGNTURE as string;
        //extracting the provided jwt token from the headers
        const authunticateHeader = req.headers.authorization as string;
        const extractedToken = authunticateHeader.split(' ')[1];
        /*verify if the given jwt is a valid jwt or not and if yes make the database request
        otherwise send an invalid token or signture message to the user*/
        jwt.verify(extractedToken, secretSignture)?next ():'Invalid token or signture!';
    }catch(err: unknown) {
        res.status(401);
        res.send(`An error was caught during authnticating token ${err}`);
    }
};