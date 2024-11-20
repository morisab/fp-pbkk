import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../components/LandingPage.vue';
import SignInPage from '../components/SignIn.vue';
import SignUpPage from '../components/SignUp.vue';
import HomePage from '../components/HomePage.vue';
import AdminDashboard from '../components/AdminDashboard.vue';
import UserManagement from '../components/UserManagement.vue';
import OrderManagement from '../components/OrderManagement.vue';
import MenuManagement from '../components/MenuManagement.vue';
import PaymentPage from '../components/PaymentPage.vue';
import OrderPage from '../components/OrderPage.vue';
import OrderHistory from '../components/OrderHistory.vue';
import ReviewPage from '../components/ReviewPage.vue';

const routes = [
    { path: '/', component: LandingPage },
    { path: '/login', component: SignInPage },
    { path: '/register', component: SignUpPage },
    { path: '/home', component: HomePage },
    { path: '/payment', component: PaymentPage },
    { path: '/order', component: OrderPage },
    { path: '/orders-history', component: OrderHistory },
    { path: '/order/:id/review', component: ReviewPage },
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
        beforeEnter: (to, from, next) => {
            const isAdmin = localStorage.getItem('isAdmin');
            if (isAdmin === '1') {
                next();
            } else {
                next('/home');
            }
        },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
export default router;
