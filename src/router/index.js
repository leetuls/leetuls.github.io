import { createRouter, createWebHistory } from 'vue-router';
import home from './frontend/home';
import Page404 from './frontend/page-not-found';
import admin from './admin/admin';

const routes = [...home, ...Page404, ...admin];
const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;