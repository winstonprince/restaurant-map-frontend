import Vue from 'vue'
import Router from 'vue-router'
import Layout from './layouts/Layout'
import Home from './views/Home'
import About from './views/About'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            name: 'home',
            component: Layout,
            children: [
                { path: '/', name: 'Home', component: Home },
            ]
        },
        {
            path: '/about',
            name: 'about',
            component: Layout,
            meta: { title: 'Home' },
            children: [
                { path: '/', name: 'About', component: About },
            ]
        }
    ]
})