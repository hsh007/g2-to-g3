import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
	redirect: '/site',
	children:[
		{
			path: 'site',
			name: '电站',
			component: () => import('../views/Site.vue'),
		},
		{
			path: 'data',
			name: '数据迁移',
			component: () => import('../views/Data.vue'),
		},
		{
			path: 'gateway-details',
			name: '网关详情',
			component: () => import('../views/Gateway-details.vue'),
		},
		{
			path: 'gateway-details/:id',
			name: '网关详情',
			component: () => import('../views/Gateway-details.vue'),
		},
		{
			path: 'uphistory',
			name: '升级历史',
			component: () => import('../views/Uphistory.vue'),
		}
	]
  }
]

const router = new VueRouter({
  routes
})

export default router
