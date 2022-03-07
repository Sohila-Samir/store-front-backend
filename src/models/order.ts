import { QueryResult } from 'pg';
import client from '../database';

//creating types for the data returned by the orders class methods
export type orderType = {
    id?: number,
    user_id: string | number,
    status: string
}

export type orderTotalPaymentType = {
    total_payment: string
}
/*------------------------------------------------------------------------------------------------------*/

export class OrderClass {
    //adding new order
    async newOrder (order: orderType): Promise<orderType | string> {
        try {
            //check first if the status intered in only either active or complete and if not return an error message
            if(order.status === 'active' || order.status === 'complete') {
                const connect = await client.connect();
                const newOrderQry = 'INSERT INTO order_header (user_id, status) VALUES ($1, $2) RETURNING *';
                const addNewOrder = await connect.query(newOrderQry, [order.user_id as string, order.status]) as QueryResult<orderType>;
                connect.release();
                return addNewOrder.rows[0];
            }
            return 'invalid status input';
        }catch(err: unknown) {
            throw new Error(`an error occured during adding your order to the orders list: ${err}`);
        }
    }
    /*------------------------------------------------------------------------------------------------------------------------------------*/
    //deleting a certain order
    async deleteOrder (orderId: number): Promise<orderType | string>  {
        try{
            const connect = await client.connect();
            const deleteOrderQry = 'DELETE FROM order_header WHERE id = $1 RETURNING *';
            const deleteOrder = await connect.query(deleteOrderQry, [orderId as number]) as QueryResult<orderType>;
            connect.release();
            return deleteOrder.rowCount?deleteOrder.rows[0]:`there is no order id for ${orderId}`;
        }catch(err: unknown) {
            throw new Error(`an error occured during deleting your order from the orders list: ${err}`);
        }
    }
    /*------------------------------------------------------------------------------------------------------------------------------------*/
    //updating a certain column with a certain value in a certain order
    async updateOrder (column: string, newValue: string | number, orderId: number): Promise<orderType | string>  {
        try {
            /*check first if the column needed to update is status, make sure to only be updated to either active or complete
            otherwise update the column specified with the new value*/
            if(column === 'status' && newValue !== 'active' && newValue !== 'complete') {
                return 'Invalid status input';
            }
            const connect = await client.connect();
            const updateOrderQry = `UPDATE order_header SET ${column} = $1 WHERE id = $2 RETURNING *`;
            const updateOrder = await connect.query(updateOrderQry, [newValue, orderId]) as QueryResult<orderType>;
            connect.release();
            return updateOrder.rows[0];
        }catch(err: unknown) {
            throw new Error(`an error occured during updating your order: ${err}`);
        }
    }
    /*------------------------------------------------------------------------------------------------------------------------------------*/
    //get a certain order
    async getOrder (orderId: number): Promise<orderType | string>  {
        try {
            const connect = await client.connect();
            const getOrderQry = 'SELECT * FROM order_header WHERE id = $1';
            const getOrder = await connect.query(getOrderQry, [orderId]) as QueryResult<orderType>;
            connect.release();
            return getOrder.rowCount?getOrder.rows[0]:`there is no order id for ${orderId}`;
        }catch(err: unknown) {
            throw new Error(`an error occured during getting your order: ${err}`);
        }
    }
    /*------------------------------------------------------------------------------------------------------------------------------------*/
    //get all orders
    async getAllOrders (): Promise<orderType[] | string>  {
        try {
            const connect = await client.connect();
            const getAllOrdersQry = 'SELECT * FROM order_header ORDER BY id ASC';
            const getAllOrders = await connect.query(getAllOrdersQry) as QueryResult<orderType>;
            connect.release();
            return getAllOrders.rowCount?getAllOrders.rows:'There is no orders';
        }catch(err: unknown) {
            throw new Error(`an error occured during getting all orders: ${err}`);
        }
    }
    /*------------------------------------------------------------------------------------------------------------------------------------*/
    //calculate the total price of all products included a certain order
    async getOrderTotalPrice (orderId: number): Promise<orderTotalPaymentType | string> {
        try {
            const connect = await client.connect();
            const getOrderTotalPriceQry = 'SELECT SUM(sub_total) AS total_payment FROM order_details WHERE order_id = $1';
            const getOrderTotalPrice = await connect.query(getOrderTotalPriceQry, [orderId]);
            connect.release();
            return getOrderTotalPrice.rowCount?getOrderTotalPrice.rows[0]:'There is no products to sum';
        }catch(err: unknown) {
            throw new Error(`an error occured during getting your order total payment : ${err}`);
        }
    }
    /*------------------------------------------------------------------------------------------------------------------------------------*/
    //get all active or completed orders by a certain user
    async getUserOrders (userId: number, status = 'active' as string): Promise<orderTotalPaymentType[] | string>  {
        try {
            //because we extracting the input from req.params so i need to make sure that the data extracted is either active or complete first
            if(status === 'active' || 'complete') {
                const connect = await client.connect();
                const currentOrderByUserQry = 'SELECT * FROM order_header WHERE user_id = $1 AND status = $2';
                const currentOrderByUser = await connect.query(currentOrderByUserQry, [userId, status]);
                connect.release();
                return currentOrderByUser.rowCount?currentOrderByUser.rows:`There is no ${status} orders to user ${userId}`;
            }
            return 'Invalid status input!';
        }catch(err: unknown) {
            throw new Error(`an error occured during getting all of your current order ${err}`);
        }
    }
    /*------------------------------------------------------------------------------------------------------------------------------------*/
}