import jwt from 'jsonwebtoken';
import express from 'express';
/*------------------------------------------------------------------------------------------------------------------------------------*/
//middleware to check for a valid jwt token before making important database requests
export const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    try {
        //get the secret signature required for generating a jwt token from env variables.
        const secretSignature = process.env.SECRET_SIGNATURE as string;
        //extracting the provided jwt token from the headers
        const authenticateHeader = req.headers.authorization as string;
        const extractedToken = authenticateHeader.split(' ')[1];
        /*verify if the given jwt is a valid jwt or not and if yes make the database request
        otherwise send an invalid token or signature message to the user*/
        jwt.verify(extractedToken, secretSignature)?next ():'Invalid token or signature!';
    }catch(err: unknown) {
        res.status(401);
        res.send(`An error was caught during authenticating your token ${err}`);
    }
};