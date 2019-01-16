import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import store from './store'
import router from './router'
import 'vuetify/dist/vuetify.min.css'
import VueResource from 'vue-resource'
import Rendiciones from './components/Rendiciones'
import Boletas from './components/Boletas'
import TablaBoletas from './components/TablaBoletas'
import FormularioRendiciones from './components/FormularioRendiciones'

Vue.use(VueResource)

Vue.component('Rendiciones', Rendiciones)
Vue.component('Boletas', Boletas)
Vue.component('TablaBoletas', TablaBoletas)
Vue.component('FormularioRendiciones', FormularioRendiciones)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
