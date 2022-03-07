import { orderProductType, ProductClass } from '../models/product';
import { OrderProductClass } from '../models/product';
import { OrderClass } from '../models/order';

describe('test the Products model', () => {
    const store= new ProductClass;
    describe('tests the CRUD mthods for Products', () => {
        it('expects creating method to to be defined and create a new row', async () => {
            expect(store.creating).toBeDefined();
            const result = await store.creating({
                name: 'Iphone 12 pro Max',
                price: '23000',
                category: 'Electronics-Mobils',
                color: 'Blue',
                description: null
            });
            expect(result).toEqual({
                id: 2,
                name: 'Iphone 12 pro Max',
                price: '23000',
                category: 'Electronics-Mobils',
                color: 'Blue',
                description: null
            });
        });
        /*-----------------------------------------------------------------------------------*/
        it('expects index method to be defined and to return all rows', async () => {
            expect(store.index).toBeDefined();
            const result = await store.index();
            expect(result.length > 0).toBeTruthy;
        });
        /*-----------------------------------------------------------------------------------*/
        it('expects reading method to be defined and to return the specified row', async () => {
            expect(store.reading).toBeDefined();
            const result = await store.reading(2);
            expect(result).toEqual({
                id: 2,
                name: 'Iphone 12 pro Max',
                price: '23000',
                category: 'Electronics-Mobils',
                color: 'Blue',
                description: null
            });
        });
        /*-----------------------------------------------------------------------------------*/
        it('expects updating method to be defined and to update and return the element where the update occured', async () => {
            expect(store.updating).toBeDefined();
            const result = await store.updating('color', 'silver', 2);
            expect(result).toEqual({
                id: 2,
                name: 'Iphone 12 pro Max',
                price: '23000',
                category: 'Electronics-Mobils',
                color: 'silver',
                description: null
            });
        });
        /*-----------------------------------------------------------------------------------*/
        it('test the getProductsByCategory method to get products by category', async () => {
            expect(store.getProductsByCategory).toBeDefined;
            const result = await store.getProductsByCategory('Electronics-Mobils');
            expect(result).not.toEqual('There is no products in Electronics-Mobils');
            expect(result).not.toThrowError;
        });
    });
    /*--------------------------------------------------------------------------------------------------------------------*/
                                        //END OF TESTS FOR CRUD MTHODS FOR PRODUCTS TABLE//
    /*--------------------------------------------------------------------------------------------------------------------*/
    describe('tests the CRUD methods for orders products', () => {
        const order = new OrderClass;//this needed for testing on order_details table
        const op = new OrderProductClass;// op >>> order product
        beforeAll(async () => {
            await order.newOrder({
                user_id: 3,
                status: 'active'
            });
        });
        /*--------------------------------------------------------------------------------------------------------------------*/
        it('tests the addProuctToOrders method to add a new order product to the order_details table', async () => {
            const orderProductBody = {
                order_id: 3,
                product_id: 2,
                qty: 1,
                product_price: 23000
            } as orderProductType;
            const calladdProuctToOrders = await op.addProuctToOrders(orderProductBody);
            expect(calladdProuctToOrders).toEqual({
                id: 3,
                order_id: '3',
                product_id: '2',
                qty: 1,
                product_price: 23000,
                sub_total: 23000
            } as orderProductType);
        });
        /*----------------------------------------------------------------------------------------------------------------------*/
        it('tests the updateOrderProduct method to update the specified column with the specified new value in the certain row', async () => {
            const updateOrderProduct = await op.updateOrderProduct('qty', 2, 3, 3);
            expect(updateOrderProduct).toEqual({
                id: 3,
                order_id: '3',
                product_id: '2',
                qty: 2,
                product_price: 23000,
                sub_total: 46000
            } as orderProductType);
        });
        /*----------------------------------------------------------------------------------------------------------------------*/
        it('tests the showOrderProducts method in order to get all products of the specified order', async () => {
            const getOrderProducts = await op.showAllOrderProducts('3');
            expect(getOrderProducts).toEqual([{
                id: 3,
                order_id: '3',
                product_id: '2',
                qty: 2,
                product_price: 23000,
                sub_total: 46000
            }] as orderProductType[]);
        });
        /*----------------------------------------------------------------------------------------------------------------------*/
        it('tests the getAllOrdersProducts method to return all orders products', async () => {
            const getAllOrdersProducts = await op.getAllOrdersProducts();
            expect(getAllOrdersProducts).not.toThrowError;
            expect(getAllOrdersProducts.length).toBeTrue;
        });
        /*----------------------------------------------------------------------------------------------------------------------*/
        it('tests the deleteOrderProduct method to delete an order product from the specified order', async () => {
            const deleteOrderProduct = await op.deleteOrderProduct(3, 3);
            expect(deleteOrderProduct).toEqual({
                id: 3,
                order_id: '3',
                product_id: '2',
                qty: 2,
                product_price: 23000,
                sub_total: 46000
            });
        });
        /*----------------------------------------------------------------------------------------------------------------------*/
                                            //END OF TESTING FOR ORDERPRODUCT CLASS//
        /*----------------------------------------------------------------------------------------------------------------------*/
        //NOTE: I ADDED THIS METHOD FROM THE PRODUCTCLASS AT THE END IN ORDER TO NOT CREATE ANOTER PRODUCT AGAIN FOR TESTING ON ORDER_DETAILS TABLE
        it('expects deleting method to be defined and to delete a the given element specifie by its id', async () => {
            expect(store.deleting).toBeDefined();
            const result = await store.deleting(2);
            expect(result).toEqual({
                id: 2,
                name: 'Iphone 12 pro Max',
                price: '23000',
                category: 'Electronics-Mobils',
                color: 'silver',
                description: null
            });
        });
    });
});