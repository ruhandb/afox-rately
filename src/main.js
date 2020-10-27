import Vue from 'vue'
//import VueRouter from 'vue-router'
import App from './App.vue'
import CreateRate from './components/CreateRate'
const NotFound = { template: '<p>Página não encontrada</p>' }

Vue.config.productionTip = false;
/*Vue.use(VueRouter);


 const routes = [
  { path: '/', component: App },
  { path: '/create', component: CreateRate },
  { path: '*', component: NotFound }
]

const router = new VueRouter({
  mode: 'history',
  routes: routes
})

new Vue({
  router
}).$mount('#app') */

const routes = {
  '/create': CreateRate,
  '/': App
}
new Vue({
  data: {
    currentRoute: window.location.pathname
  },
  computed: {
    ViewComponent () {
      Array.forEach(routes, (value) =>{
        if(this.currentRoute.startsWith(value)){
          return value;
        }
      });
      return NotFound
    }
  },
  render (h) { return h(this.ViewComponent) }
}).$mount('#app')
