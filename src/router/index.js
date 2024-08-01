import Vue from 'vue'
import Router from 'vue-router'
import HomeView from '../views/HomeView.vue';
import ProductView from '@/views/ProductView.vue';
import LoginView from '@/views/LoginView.vue';
import UserView from '@/views/user/UserView.vue';
import UserProducts from '@/views/user/UserProducts.vue';
import UserEdit from '@/views/user/UserEdit.vue';
import UserPurchases from '@/views/user/UserPurchases.vue';
import UserSales from '@/views/user/UserSales.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'homeView',
      component: HomeView
    },
    {
      path: '/produto/:id',
      name: 'produto',
      component: ProductView,
      props: true
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/usuario',
      component: UserView,
      children: [
        {
          path: '',
          name: 'usuario',
          component: UserProducts,
        },
        {
          path: 'editar',
          name: 'usuario-editar',
          component: UserEdit,
        },
        {
          path: 'compras',
          name: 'compras',
          component: UserPurchases,
        },
        {
          path: 'vendas',
          name: 'vendas',
          component: UserSales,
        },
      ]
    },
  ],
  scrollBehavior() {
    return window.scrollTo({ top: 0, behavior: 'smooth' })
  }
});

