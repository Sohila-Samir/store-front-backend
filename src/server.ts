// necessary packages for production and development
import express, { Request, Response }  from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

//importing products routes
import { productRoutes } from './controllers/product-route-handlers';

//importing users routes
import { userRoutes }from './controllers/users-route-handlers';

//importing orders routes
import { orderHeaderRoutes } from './controllers/order-header-route-handler';

//importing dashboard routes
import { dashBoardServiceRoutes } from './services/dashboard-route-handler';

//initializing the express aplication and starting a server
const app: express.Application = express();
const  port: number = (process.env.PORT as unknown) as number || 2147;

app.listen(port, (): void => {
    console.log(`listening on port ${port}`);
});

//using the neccessary dependencies in the application object
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*end of setup-----------------------------------------------------------------------------------------------------------*/
//main route
app.get('/', (req: Request, res: Response) => {
    res.send('HELLO WORLD!');
});

//products routes
productRoutes(app);

//users routes
userRoutes(app);

//orders routes
orderHeaderRoutes(app);

//dashboard routes
dashBoardServiceRoutes(app);
//exporting the express aplication to use in when testing on modules endpoints
export default app;
