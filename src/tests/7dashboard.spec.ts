import { ProductClass, OrderProductClass } from '../models/product';
import { dashBoardServicesClass } from '../services/dashboard';

describe('tests the dashboard service file', () => {
    const dashboard = new dashBoardServicesClass;
    beforeAll(async () => {
        const product = new ProductClass;
        const op = new OrderProductClass;
        /////////////////////////////////////////////////
        await product.creating({
            name: 'Iphone 12 pro Max',
            price: '23000',
            category: 'Electronics | Mobils',
            color: 'Blue',
            description: null
        });
        await op.addProuctToOrders({
            order_id: '3',
            product_id: '4',
            qty: 1,
            product_price: 23000,
            sub_total: 23000
        });
    });
    it('tests the top5Products method to return most 5 products included in orders', async () => {
        const callTop5Products = await dashboard.top5Products();
        expect(callTop5Products).not.toThrowError;
        expect(callTop5Products).not.toEqual('Oops! seems like there is no products orderd yet :(');
    });
});