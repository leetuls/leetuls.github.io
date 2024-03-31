import DashBoard from '@/pages/admin/DashBoard.vue';
import Login from '@/pages/admin/Login.vue';
import CategoryList from '@/pages/admin/CategoryList.vue';
import MenuList from '@/pages/admin/MenuList.vue';
import ProductList from '@/pages/admin/ProductList.vue';

const admin = [
    {
        path: "/admin",
        name: 'admin-page',
        component: DashBoard
    },
    {
        path: "/login-admin",
        name: 'login-admin-page',
        component: Login
    },
    {
        path: "/admin/category-list",
        name: 'category-list',
        component: CategoryList
    },
    {
        path: "/admin/menu-list",
        name: 'menu-list',
        component: MenuList
    },
    {
        path: "/admin/product-list",
        name: 'product-list',
        component: ProductList
    }
];

export default admin;