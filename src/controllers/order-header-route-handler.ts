//adding the required model files and middleware...etc for this file
import express, { Request, Response } from 'express';
import { OrderClass, orderType } from '../models/order';
import { authunticateToken } from '../modules/authnticate-token';

//intializing an order instance of the order class
const order = new OrderClass;
/*-------------------------------------END OF SETUP FOR WORKING ON ORDERS CLASS METHODS HANDLERS---------------------------------*/
//adding route handlers for all orders endpoints
const newOrderHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const addedOrderBody = {
            user_id: req.body.user_id as string,
            status: req.body.status as string
        } as orderType;
        const callNewOrderMethod = await order.newOrder(addedOrderBody);
        res.json(callNewOrderMethod );
    }catch(err: unknown) {
        res.status(401);
        res.json(`${err}`);
    }
};
/*--------------------------------------------------------------------------*/
//deleting a certain order handler
const deleteOrderHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const callDeleteOrderMethod = await order.deleteOrder(parseInt(req.params.id));
        res.json(callDeleteOrderMethod);
    }catch(err: unknown) {
        res.status(401);
        res.json(`${err}`);
    }
};
/*--------------------------------------------------------------------------*/
//updating a certain column with a certain value in a certain order handler
const updateOrderHandler = async (req: Request, res: Response): Promise<void> => {
    try{
        const callupdateOrderMethod = await order.updateOrder(req.body.column, req.body.new_value, parseInt(req.params.id));
        res.json(callupdateOrderMethod);
    }catch(err: unknown) {
        res.status(401);
        res.json(`${err}`);
    }
};
/*--------------------------------------------------------------------------*/
//getting a certain order handler using it's id
const getOrderHandler = async (req: Request, res: Response): Promise<void> => {
    try{
        const callGetOrder = await order.getOrder(parseInt(req.params.id));
        res.json(callGetOrder);
    }catch(err: unknown) {
        res.status(401);
        res.json(`${err}`);
    }
} ;
/*--------------------------------------------------------------------------*/
//getting all orders
const getAllOrdersHandler = async (req: Request, res: Response): Promise<void> => {
    try{
        const callGetAllOrders = await order.getAllOrders();
        res.json(callGetAllOrders);
    }catch(err: unknown) {
        res.status(401);
        res.json(`${err}`);
    }
};
/*--------------------------------------------------------------------------*/
//get the total price of all products included in the specified order
const getOrderTotalPriceHandler = async (req: Request, res: Response): Promise<void> => {
    try{
        const callGetOrderTotalPrice = await order.getOrderTotalPrice(parseInt(req.params.id));
        res.json(callGetOrderTotalPrice);
    }catch(err: unknown) {
        res.status(401);
        res.json(`${err}`);
    }
};
/*--------------------------------------------------------------------------*/
//get all active or completed orders to the specified user
const getUserOrdersHandler = async (req: Request, res: Response): Promise<void> => {
    try{
        const callGetUserOrders = await order.getUserOrders(parseInt(req.params.uid), req.params.status);//uid user id
        res.json(callGetUserOrders);
    }catch(err: unknown) {
        res.status(401);
        res.json(`${err}`);
    }
};
/*--------------------------------------------------------------------------*/
//adding endpoints for each route handler
export const orderHeaderRoutes = (app: express.Application) => {
    app.get('/orders', authunticateToken, getAllOrdersHandler);
    app.get('/orders/:id',authunticateToken, getOrderHandler);
    app.get('/orders/:id/total-payment',authunticateToken, getOrderTotalPriceHandler);
    app.get('/orders/:status/users/:uid',authunticateToken, getUserOrdersHandler);
    app.post('/orders', newOrderHandler);
    app.delete('/orders/:id',authunticateToken, deleteOrderHandler);
    app.put('/orders/:id', authunticateToken, updateOrderHandler);
};
