import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Boletas from './components/Boletas.vue'
import Rendiciones from './components/Rendiciones.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Inicio',
      component: Home
    },
    {
      path: '/Boletas',
      name: 'Boletas',
      component: Boletas
    },
    {
      path: '/Rendiciones',
      name: 'Rendiciones',
      component: Rendiciones
    }
  ]
})
