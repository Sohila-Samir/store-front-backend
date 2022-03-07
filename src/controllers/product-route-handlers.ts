import expres, { Request, Response } from 'express';
import { authunticateToken } from '../modules/authnticate-token';
import { productType, ProductClass, OrderProductClass } from '../models/product';

const store = new ProductClass;
const op = new OrderProductClass;//op >>> order prop
/*-------------------------------------END OF SETUP FOR WORKING ON PRODUCTS CLASS METHODS HANDLERS---------------------------------*/
//get a certain product
const getProductHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await store.reading(parseInt(req.params.id));
        res.json(result);
    }catch(err: unknown) {
        res.status(401);
        res.send(err);
    }
};
/*----------------------------------------------------------------------------------------*/
//get all products in the list
const getAllProductHandler = async (_req: Request, res: Response): Promise<void> => {
    try {
        const result = await store.index();
        res.json(result);
    }catch(err: unknown) {
        res.status(401);
        res.send(err);
    }
};
/*----------------------------------------------------------------------------------------*/
//add new product to the products list
const addProductHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const newProduct = {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            color: req.body.color,
            description: req.body.description
        };
        const result = await store.creating(newProduct as productType);
        res.json(result);
    }catch(err: unknown) {
        res.status(401);
        res.send(err);
    }
};
/*----------------------------------------------------------------------------------------*/
//update a certain column with a certain new value in a certain product
const updateProductHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await store.updating(req.body.column, req.body.new_value, parseInt(req.params.id));
        res.json(result);
    }catch(err: unknown) {
        res.status(401);
        res.send(`an error occured ${err}`);
    }
};
/*----------------------------------------------------------------------------------------*/
//get all products that share the same specified category
const getProductsByCategoryHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const getProductsByCategory = await store.getProductsByCategory(req.params.category);
        res.json(getProductsByCategory);
    }catch(err: unknown) {
        res.status(401);
        res.send(`an error occured during getting all products by the specified category${err}`);
    }
};
/*----------------------------------------------------------------------------------------*/
//delete a certain product from the products list
const deleteProductHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await store.deleting(parseInt(req.params.id));
        res.json(result);
    }catch(err: unknown) {
        res.status(401);
        res.send(err);
    }
};
            /*---------------------------------------------------------------------------------------------------*/
                                            //END OF CRUD MTHODS HANDLERS FOR PRODUCTS TABLE//
            /*---------------------------------------------------------------------------------------------------*/

//add new product to a certain order
const addOrderProductHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderProductBody = {
            order_id: req.params.id,
            product_id: req.body.product_id,
            qty: req.body.qty,
        };
        const callAddProuctToOrdersMethod = await op.addProuctToOrders(orderProductBody);
        res.json(callAddProuctToOrdersMethod);
    }catch (err: unknown) {
        res.status(401);
        res.json(`${err}`);
    }
};
/*----------------------------------------------------------------------------------------*/
//get all products that have been included in orders
const getAllOrdersProductsHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const callGetAllOrdersProducts = await op.getAllOrdersProducts();
        res.json(callGetAllOrdersProducts);
    }catch(err: unknown) {
        res.status(401);
        res.json(`${err}`);
    }
};
/*----------------------------------------------------------------------------------------*/
//show all products that have been included to a certain order
const showAllOrderProductsHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const callshowAllOrderProducts = await op.showAllOrderProducts(req.params.id);
        res.json(callshowAllOrderProducts);
    }catch(err: unknown) {
        res.status(401);
        res.json(`${err}`);
    }
};
/*----------------------------------------------------------------------------------------*/
//update a certain column with a new value in a certain order product related to a certain order
const updateOrderProductHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        //opid >>> orderProductId
        const callupdateOrderProduct = await op.updateOrderProduct(req.body.column,req.body.new_value, parseInt(req.params.opid), parseInt(req.params.id));
        res.json(callupdateOrderProduct);
    }catch(err: unknown) {
        res.status(401);
        res.json(`${err}`);
    }
};
/*----------------------------------------------------------------------------------------*/
//deleting a certain order product in a certain order
const deleteOrderProductHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const calldeleteOrderProduct = await op.deleteOrderProduct(parseInt(req.params.id), parseInt(req.params.opid));
        res.json(calldeleteOrderProduct);
    }catch(err: unknown) {
        res.status(401);
        res.json(`${err}`);
    }
};
            /*---------------------------------------------------------------------------------------------------*/
                                            //END OF CRUD MTHODS HANDLERS FOR ORDER_DETAILS TABLE//
            /*---------------------------------------------------------------------------------------------------*/
//creating restful routes for the methods of products & order_details tables
export const productRoutes = (app: expres.Application) => {
    app.get('/products/:id', getProductHandler);
    app.get('/products', getAllProductHandler);
    app.get('/products/categories/:category', authunticateToken, getProductsByCategoryHandler);
    app.post('/products', authunticateToken, addProductHandler);
    app.put('/products/:id', authunticateToken, updateProductHandler);
    app.delete('/products/:id',authunticateToken, deleteProductHandler);
    /*-----------------------------------------------------------------------------------------------------------------*/
    app.get('/orders/products', getAllOrdersProductsHandler);
    app.get('/orders/:id/products', showAllOrderProductsHandler);
    app.post('/orders/:id/products', addOrderProductHandler);
    app.put('/orders/:id/products/:opid', authunticateToken,updateOrderProductHandler);//opid >>> order Product Id
    app.delete('/orders/:id/products/:opid', authunticateToken, deleteOrderProductHandler);//opid >>> order Product Id
};
