import { OrderClass, orderTotalPaymentType } from '../models/order';
import { orderType} from '../models/order';
import { User } from '../models/user';
import { OrderProductClass } from '../models/product';
import { ProductClass } from '../models/product';

describe('tests order module', () => {
    //creating a new user so i can access it on the user_id column in order_header table
    const store = new ProductClass;
    const user = new User;
    beforeAll( async () => {
        await store.creating({
            name: 'Iphone 12 pro Max',
            price: '23000',
            category: 'Electronics-Mobils',
            color: 'Blue',
            description: null
        });
        await user.newUser({
            first_name: 'Illegal',
            last_name: 'Potato',
            password: 'stars852456'
        });
    });
    //intializing a new order instance from orderClass class
    const order = new OrderClass;
    /*--------------------------------------------------------------------------------------------------------------------*/
    describe('expects the methods return values to work as intended and to be defined', () => {
        it('tests the newOrder method to create a new order', async () => {
            const newOrderBody = {
                user_id:  3,
                status: 'active'
            } as  orderType;
            const callNewOrderMethod = await order.newOrder(newOrderBody);
            expect(callNewOrderMethod).toBeDefined;
            expect(callNewOrderMethod).toEqual({
                id: 1,
                user_id:  '3',
                status: 'active'
            });
        });
        /*--------------------------------------------------------------------------------------------------------------------*/
        it('tests the updateOrder method to update an existing order', async () => {
            const callUpdateOrderMethod = await order.updateOrder('status', 'complete', 1);
            expect(callUpdateOrderMethod).not.toThrowError;
            expect(callUpdateOrderMethod).toBeDefined;
            expect(callUpdateOrderMethod).toEqual({
                id: 1,
                user_id:  '3',
                status: 'complete'
            });
        });
        /*--------------------------------------------------------------------------------------------------------------------*/
        it('tests the getAllOrders method to return all orders', async () => {
            const callGetAllOrderMethod = await order.getAllOrders();
            expect(callGetAllOrderMethod.length > 0).toBeTrue;
        });
        /*--------------------------------------------------------------------------------------------------------------------*/
        it('tests the getOrder method to return a certain order', async () => {
            const callGetOrderMethod = await order.getOrder(1);
            expect(callGetOrderMethod).toEqual({
                id: 1,
                user_id:  '3',
                status: 'complete'
            });
        });
        it('tests the getUserOrder method to return all Active or Completed orders by the user', async () => {
            const activeOrders = await order.getUserOrders(3,'active');
            const completedOrders = await order.getUserOrders(3, 'aomplete');
            expect(activeOrders).not.toEqual('There is no Active orders to user 3');
            expect(completedOrders).not.toEqual('There is no Complete orders to user 3');
        });
        /*--------------------------------------------------------------------------------------------------------------------*/
        it('tests the getOrderTotalPrice method to get the total price of all prooducts in an order', async () => {
            const op = new OrderProductClass;// op >>> order product
            (await op.addProuctToOrders({
                order_id: 1,
                product_id: 1,
                qty: 1,
                product_price: 23000
            }));
            const callGetOrderTotalPrice = await order.getOrderTotalPrice(1);
            expect(callGetOrderTotalPrice).toEqual({
                total_payment: '23000'
            } as orderTotalPaymentType);
            (await op.deleteOrderProduct(1, 1));
        });
    });
            /*---------------------------------------------------------------------------------------------------*/
                                    //END OF TESTSING FOR CORRECT ORDERS MTHODS CALLING//
            /*---------------------------------------------------------------------------------------------------*/
    describe('expects the custom error messages to be returned when things go wrong in methods', () => {
        it('tests if (getOrder) method will return the custom error when an order id does not exist', async () => {
            const wrongCallGetOrderMethod = await order.getOrder(5);
            expect(wrongCallGetOrderMethod).toThrowError;
            expect(wrongCallGetOrderMethod).toEqual('there is no order id for 5');
        });
        /*--------------------------------------------------------------------------------------------------------------------*/
        it('tests if (deleteOrder) methor will return the custom error when an order id does not exist', async () => {
            const wrongCallDeleteOrderMthod = await order.deleteOrder(5);
            expect(wrongCallDeleteOrderMthod).toThrowError;
            expect(wrongCallDeleteOrderMthod).toEqual('there is no order id for 5');
        });
        /*--------------------------------------------------------------------------------------------------------------------*/
    //I ADDED THOSE TWO AT THE END SO I DO NOT HAVE TO CRETAE ANOTHER ORDER AGAN FOR THE GETTING THE TOTAL PRICE METHOD
    });
    it('tests the deleteOrder method to delete a certain order', async () => {
        const callDeleteOrderMethod = await order.deleteOrder(1);
        expect(callDeleteOrderMethod).toEqual({
            id: 1,
            user_id:  '3',
            status: 'complete'
        });
    });
    /*--------------------------------------------------------------------------------------------------------------------*/
    it('tests if (getAllOrders) will return the custom error when there is no orders', async () => {
        const wrongcallGetAllOrdersMthod = await order.getAllOrders();
        expect(wrongcallGetAllOrdersMthod).toThrowError;
        expect(wrongcallGetAllOrdersMthod).toEqual('There is no orders');
    });
    /*--------------------------------------------------------------------------------------------------------------------*/
});