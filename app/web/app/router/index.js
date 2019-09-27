'use strict';
import Vue from 'vue';
import VueRouter from 'vue-router';
import Router from './router';
import { LoadingBar } from 'iview'

Vue.use(VueRouter);
const files = require.context('../page', true, /^\.\/([A-Z][A-Za-z0-9]+)+\/main\.vue$/);
const pages = files.keys().map(key => files(key).default);

export default function createRouter(getStore) {
    const routes = [];

    pages.forEach(page => {
        if (typeof page.installRouter !== 'function') return;
        const router = new Router(getStore);
        page.installRouter(router);
        routes.push(router.exec());
    });

    const router = new VueRouter({
        base: '/',
        mode: 'history',
        routes,
    });

    router.beforeEach((to, from, next) => {
        const map = Router.BEFORE_MAP.filter(item => {
            if (!item.name) return true;
            return item.name === to.name;
        });
        LoadingBar.start()
        for (const item of map) {
            if (typeof item.func !== 'function') continue;
            if (item.func(to, from, next)) return;
        }
        next();
    });

    router.afterEach((to, from, next) => {
        LoadingBar.finish()
        const { title } = to.meta;
        if (EASY_ENV_IS_BROWSER) {
            document.title = [title, '收款助手'].filter(v => v).join(' - ')
        }

        const map = Router.AFTER_MAP.filter(item => {
            if (!item.name) return true;
            return item.name === to.name;
        });
        for (const item of map) {
            if (typeof item.func !== 'function') continue;
            if (item.func(to, from, next)) return;
        }
    });

    return router;
};
