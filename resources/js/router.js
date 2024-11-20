import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from './components/LandingPage.vue';
import LoginPage from './components/Login.vue';
import SignupPage from './components/Signup.vue';
import HomePage from './components/Home.vue';
import PaymentPage from './components/Payment.vue';
import OrderPage from './components/Order.vue';
import OrdersHistory from './components/OrdersHistory.vue';
import ReviewPage from './components/Review.vue';
import AdminDashboard from './components/AdminDashboard.vue';
import UserManagement from './components/UserManagement.vue';
import OrderManagement from './components/OrderManagement.vue';
import MenuManagement from './components/MenuManagement.vue';

const routes = [
    { path: '/', component: LandingPage },
    { path: '/login', component: LoginPage },
    { path: '/signup', component: SignupPage },
    { path: '/home', component: HomePage },
    { path: '/payment', component: PaymentPage },
    { path: '/order', component: OrderPage },
    { path: '/orders-history', component: OrdersHistory },
    { path: '/:orderId/review', component: ReviewPage },

    // Admin Routes
    {
        path: '/admin',
        component: AdminDashboard,
        children: [
            {
                path: 'users',
                component: UserManagement,
            },
            {
                path: 'orders',
                component: OrderManagement,
            },
            {
                path: 'menu',
                component: MenuManagement,

            }
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
