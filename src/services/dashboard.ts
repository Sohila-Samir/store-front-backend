import { QueryResult } from 'pg';
import client from '../database';

//creating types for the data returned by the orders class methods
export type topProducts = {
    ordered_numbers: string,
    name: string
};
/*------------------------------------------------------------------------------------------------------*/

export class dashBoardServicesClass {
    //get the top/frequently added products to orders.
    async top5Products (): Promise<topProducts[] | string> {
        try{
            const connect = await client.connect();
            const popularProductsQry = ' SELECT COUNT(products.id) AS ordered_numbers, products.name FROM products INNER JOIN order_details ON products.id = order_details.product_id GROUP BY products.id ORDER BY ordered_numbers DESC LIMIT 5';
            const getPopularProducts = await connect.query(popularProductsQry) as  QueryResult<topProducts>;
            connect.release();
            return getPopularProducts.rowCount?getPopularProducts.rows:'Oops! seems like there is no products ordered yet :(';
        }catch (err: unknown) {
            throw new Error(`an error occurred during getting the most popular products ${err}`);
        }
    }
}