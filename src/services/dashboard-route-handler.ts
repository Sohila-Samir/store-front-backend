import { Application, Request, Response } from 'express';
import { authunticateToken } from '../modules/authnticate-token';
import { dashBoardServicesClass } from './dashboard';
/*-------------------------------------END OF SETUP FOR WORKING ON DASHBOARD CLASS METHODS HANDLERS---------------------------------*/
//intializing an instance of the dashboard class
const dbs = new dashBoardServicesClass; //dbs >>> dash Board Services
///////////////////////////////////////////////////////////////////////////////////

//get the top/frequent 5 products added to orders
const top5ProductsHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const calltop5Products = await dbs.top5Products();
        res.json(calltop5Products);
    }catch (err: unknown) {
        res.status(401);
        res.json(`${err}`);
    }
};

//creating the endpoint for the dashboard class methods handlers
export const dashBoardServiceRoutes = (app: Application): void => {
    app.get('/services/top-5-products', authunticateToken, top5ProductsHandler);
};