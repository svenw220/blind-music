import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/NewLayout.vue'),
    children: [
      { 
        path: '',
        component: () => import('pages/Index.vue'),
        beforeEnter: (to, from, next) => {
          to; from;
          next()
          // if (process.env.IS_OFFLINE === 'false') {
          //   next()
          // } else if (to.path === '/' && from.path === '/offline') {
          //   next()
          // } else {
          //   next({ name: 'offline' })
          // }
          ////
          ////
          // if (process.env.IS_OFFLINE === 'true' && from.path === '/offline') {
          //   next('/')
          // } else {
          //   next({ name: 'offline' })
          // }
        },
      },
      { name: 'offline', path: 'offline', component: () => import('pages/Offline.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
