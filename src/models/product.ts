import { QueryResult } from 'pg';
import client  from '../database';

//creating necessary types for the returned data from the products and order products class methods
/*------------------------------------------------------------------------------------------------------------------------------------*/
export type productType = {
    id?: number
    name: string
    price: string
    category: string
    color?: string | null
    description?: string | null
}

export type orderProductType = {
    id?: number
    order_id: number | string
    product_id: number | string
    qty: number
    product_price?: number
    sub_total?: number
}
/*------------------------------------------------------------------------------------------------------------------------------------*/

export class ProductClass{
    //get all rows
    async index(): Promise<productType[]> {
        try {
            const connect = await client.connect();
            const getAllProductsQry = 'SELECT * FROM products ORDER BY id ASC' as  string;
            const getAllProducts =  await connect.query(getAllProductsQry) as QueryResult<productType>;
            connect.release() as void;
            return getAllProducts.rows;
        }catch (err: unknown) {
            throw new Error(`an error occured during reteriving the data from the server ${err}`);
        }
    }
    /*------------------------------------------------------------------------------------------------------------------------------------*/
    //add new product to the products table
    async creating(product: productType): Promise<productType> {
        try{
            const connect = await client.connect();
            const qry = 'INSERT INTO products (name, price, category, color, description) VALUES ($1, $2, $3, $4, $5) RETURNING *' as  string;
            const result = await connect.query(qry, [product.name, product.price, product.category, product.color, product.description]) as QueryResult;
            connect.release() as void;
            return result.rows[0];
        }catch (err: unknown) {
            throw new Error(`an error occured during inserting the data in the server ${err}`);
        }
    }
    /*------------------------------------------------------------------------------------------------------------------------------------*/
    //get a certain product from the products
    async reading(id: number): Promise<productType> {
        try{
            const connect = await client.connect();
            const qry = 'SELECT * FROM products WHERE ID = $1';
            const result = await connect.query(qry, [id]);
            connect.release();
            return result.rows[0];
        }catch (err: unknown) {
            throw new Error(`an error occured during getting the data from the server ${err}`);
        }
    }
    /*------------------------------------------------------------------------------------------------------------------------------------*/
    //update a certain column in a certain product
    async updating(updatedColumn: string, newValue: string ,productId: number): Promise<productType> {
        try{
            const connect = await client.connect();
            const qry = `UPDATE products SET ${updatedColumn} = $1 WHERE id = $2 RETURNING *`;
            const result = await connect.query(qry, [newValue, productId]);
            connect.release();
            return result.rows[0];
        }catch (err: unknown) {
            throw new Error(`an error occured during updating the data in the server ${err}`);
        }
    }
    /*------------------------------------------------------------------------------------------------------------------------------------*/
    //get all products that applay to the same specified product category
    async getProductsByCategory (category: string): Promise<productType[] | string> {
        try{
            const connect = await client.connect();
            const getProductsByCategoryQry = 'SELECT * FROM products WHERE category = $1';
            const getProductsByCategory = await connect.query(getProductsByCategoryQry, [category]) as QueryResult;
            connect.release();
            return getProductsByCategory.rowCount as number?getProductsByCategory.rows:`There is no products in ${category}`;
        }catch (err: unknown) {
            throw new Error(`an error occured during getting the data from the server ${err}`);
        }
    }
    /*------------------------------------------------------------------------------------------------------------------------------------*/
    //delete a certain product
    async deleting(id: number): Promise<productType> {
        try{
            const connect = await client.connect();
            const qry = 'DELETE FROM products WHERE id = $1 RETURNING *';
            const result = await connect.query(qry, [id]);
            connect.release();
            return result.rows[0];
        }catch (err: unknown) {
            throw new Error(`an error occured during reteriving the data from the server ${err}`);
        }
    }
    /*------------------------------------------------------------------------------------------------------------------------------------*/
                                                    //END OF CRUD MTHODS FOR PRODUCTS TABLE//
    /*------------------------------------------------------------------------------------------------------------------------------------*/
}

export class OrderProductClass {
    //add a new order product to a certain existing order
    async addProuctToOrders (orderProduct: orderProductType): Promise<orderProductType> {
        try {
            const connect = await client.connect();
            //price should not be added manuelly hence, i will get the price from the products table then assign it when cretaing the order product.
            const getProductPriceQry = 'SELECT price FROM products WHERE id = $1';
            const getProductPrice = await connect.query(getProductPriceQry, [orderProduct.product_id]);
            const productPrice = parseInt(getProductPrice.rows[0].price);
            //add the order product to a certain order in the order_details table.
            //NOTICE: I ADDED THE EXTRACTED PRICE FROM THE ABOVE QUERY AS AN ARGUMENT HERE WHEN ADDING THE ORDER PRODUCT.
            const addOrderProductQry = 'INSERT INTO order_details (order_id, product_id, qty, product_price, sub_total) VALUES ($1,$2,$3,$4,$5) RETURNING *';
            //here i will add a variable that caluclates the sub_total first based on the specified qty and the extracted product price from the first query.
            const getSubTotalPrice: number = orderProduct.qty as number * productPrice ;
            //finallt i will added all extracted data from the last querirs alongside the specified inputs from the user.
            const addOrderProduct = await connect.query(addOrderProductQry,
                [orderProduct.order_id, orderProduct.product_id, orderProduct.qty, productPrice, getSubTotalPrice]) as QueryResult<orderProductType>;
            connect.release();
            return addOrderProduct.rows[0];
        }catch (err: unknown) {
            throw new Error(`an error occured during adding your product to the orders list ${err}`);
        }
    }
    /*------------------------------------------------------------------------------------------------------------------------------------*/
    //show all order products for orders made
    async getAllOrdersProducts (): Promise<orderProductType[]> {
        try {
            const connect = await client.connect();
            const getAllOrdersProductsQry = 'SELECT * FROM order_details ORDER BY id ASC';
            const getAllOrdersProducts = await connect.query(getAllOrdersProductsQry);
            connect.release();
            return getAllOrdersProducts.rows;
        }catch (err: unknown) {
            throw new Error(`an error occured during getting all orders products from the orders list ${err}`);
        }
    }
    /*------------------------------------------------------------------------------------------------------------------------------------*/
    //show all order products related to the specified order.
    async showAllOrderProducts (orderId: string): Promise<orderProductType[] | string> {
        try {
            const connect = await client.connect();
            const showAllOrderProductsQry = 'SELECT * FROM order_details WHERE order_id = $1 ORDER BY id ASC';
            const showAllOrderProducts = await connect.query(showAllOrderProductsQry, [orderId]);
            connect.release();
            return showAllOrderProducts.rowCount?showAllOrderProducts.rows:`seems like there is no products in order ${orderId} in the orders list`;
        }catch (err: unknown) {
            throw new Error(`an error occured during reteriving all of your order products ${err}`);
        }
    }
    /*------------------------------------------------------------------------------------------------------------------------------------*/
    //updating a certain column with a certain new value in a certain order product related to a certain order.
    async updateOrderProduct (column: string, newValue: number | string, orderProductId: number, orderId: number): Promise<orderProductType> {
        try {
            const connect = await client.connect();
            const updateOrderProductQry = `UPDATE order_details SET ${column} = $1 WHERE id = $2 AND order_id = $3 RETURNING *`;
            //in case the column needed to be updated is qty, we need to update the sub_total column as well
            if(column === 'qty') {
                //get the product price of the order that is needed to apply changes on.
                const getProductPriceQry = 'SELECT product_price FROM order_details WHERE id = $1';
                const getProductPrice = await connect.query(getProductPriceQry, [orderProductId]);
                const productPrice = getProductPrice.rows[0].product_price;
                //take the product price and multiply it to the qty specified then take the result and update the sub_total column with this result.
                const updateSubTotalQry = `UPDATE order_details SET sub_total = ${newValue as number * productPrice} WHERE id = $1 AND order_id = $2`;
                await connect.query(updateSubTotalQry, [orderProductId, orderId]);
                //update the qty column with the new value lastly.
                const updateQty = await connect.query(updateOrderProductQry, [newValue, orderProductId, orderId]);
                return updateQty.rows[0];
            }
            const updateOrderProduct = await connect.query(updateOrderProductQry, [newValue, orderProductId, orderId]);
            connect.release();
            return updateOrderProduct.rows[0];
        }catch (err: unknown) {
            throw new Error(`an error occured during updating your order product from the orders list ${err}`);
        }
    }
    /*------------------------------------------------------------------------------------------------------------------------------------*/
    //delete a certain order product
    async deleteOrderProduct (orderId: number ,orderProductId: number): Promise<orderProductType | string> {
        try {
            const connect = await client.connect();
            const deleteOrderProductQry = 'DELETE FROM order_details WHERE order_id = $1 AND id = $2 RETURNING *';
            const deleteOrderProduct = await connect.query(deleteOrderProductQry, [orderId, orderProductId]);
            connect.release();
            return deleteOrderProduct.rowCount?deleteOrderProduct.rows[0]:`seems like there is no product ${orderProductId} in order ${orderId}`;
        }catch (err: unknown) {
            throw new Error(`an error occured during deleting your order product ${err}`);
        }
    }
}