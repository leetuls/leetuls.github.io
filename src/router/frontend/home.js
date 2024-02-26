import Content from '../../layouts/frontend/Content.vue';
import LoginPage from '@/pages/frontend/LoginPage.vue';
import ProductsPage from '@/pages/frontend/ProductsPage.vue';
import ProductDetailsPage from '@/pages/frontend/ProductDetailsPage.vue';
import CheckoutPage from '@/pages/frontend/CheckoutPage.vue';
import CartPage from '@/pages/frontend/CartPage.vue';
import BlogListPage from '@/pages/frontend/BlogListPage.vue';
import BlogSinglePage from '@/pages/frontend/BlogSinglePage.vue';
import ContactPage from '@/pages/frontend/ContactPage.vue';

const home = [
    {
        path: "/",
        name: 'home-page',
        component: Content,
    },
    {
        path: "/login",
        name: 'login-page',
        component: LoginPage,
    },
    {
        path: "/shop",
        name: 'products-page',
        component: ProductsPage,
    },
    {
        path: "/product-details",
        name: 'products-detail-page',
        component: ProductDetailsPage,
    },
    {
        path: "/checkout",
        name: 'checkout-page',
        component: CheckoutPage,
    },
    {
        path: "/cart",
        name: 'cart-page',
        component: CartPage,
    },
    {
        path: "/blog-list",
        name: 'blog-list-page',
        component: BlogListPage,
    },
    {
        path: "/blog-single",
        name: 'blog-single-page',
        component: BlogSinglePage,
    },
    {
        path: "/contact-us",
        name: 'contact-us-page',
        component: ContactPage,
    }
];

export default home;