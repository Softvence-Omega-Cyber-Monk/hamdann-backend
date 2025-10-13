import { Router } from 'express';
import authRoute from './app/modules/auth/auth.route';
import userRoute from './app/modules/user/user.route';
import { productRoutes } from './app/modules/products/products.route';
import { OrderRoute } from './app/modules/order/order.route';
import { CartRoute } from './app/modules/cart/cart.route';
import { PromotionRoute } from './app/modules/promotion/promotion.route';
import { supportRoutes } from './app/modules/supports/support.route';
import { paymentRoutes } from './app/modules/payment/payment.route'


const appRouter = Router();

const moduleRoutes = [
    { path: '/auth', route: authRoute },
    { path: "/user", route: userRoute },
    { path: "/product", route: productRoutes },
    { path: "/cart", route: CartRoute },
    { path: "/order", route: OrderRoute },
    { path: "/promotion", route: PromotionRoute },
    { path: "/support", route: supportRoutes},
    { path: "/payment", route: paymentRoutes }


];

moduleRoutes.forEach(route => appRouter.use(route.path, route.route));
export default appRouter;