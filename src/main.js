import Vue from 'vue'
import App from './App.vue'
import Login from './components/Login'
import CreateRate from './components/CreateRate'
import VoteRate from './components/VoteRate'
//import { firebase } from './config/firebase'
import vuetify from './plugins/vuetify';

const NotFound = { template: '<p>Página não encontrada</p>' }

Vue.config.productionTip = false;

const routes = {
  '/': { component: App },
  '/login': { component: Login },
  '/vote': { component: VoteRate, query: ['id'], authRequired: true },
  '/rate/edit': { component: CreateRate, query: ['id'], authRequired: true }
}
new Vue({
  data: {
    currentRoute: window.location.pathname
  },

  mounted() {
    /* firebase.auth().onAuthStateChanged(user => {
      console.log("user",user);
      var pathName = this.getRoutePath();
      Vue.prototype.$user = user;
      if(!user && routes[pathName] && routes[pathName].authRequired){
        var idxqp = window.location.href.indexOf('?');
        var queryParams = idxqp > 0 ? "&" + window.location.href.substring(idxqp + 1) : "";
        window.location.href = '/login?redirect=' + window.location.pathname + queryParams;
      }
    }); */
  },

  computed: {
    ViewComponent () {
      var pathName = this.getRoutePath();
      const route = routes[pathName];
      if(route) {
        var queryObj = {}
        var idxqp = window.location.href.indexOf('?');
        if(route.query) {
          var pathParams = this.currentRoute === pathName ? "" : this.currentRoute.substring(pathName.length + 1, idxqp < 0 ? this.currentRoute.length : idxqp).split('/');
          route.query.forEach((value, index) => {
            if(pathParams[index]) {
              queryObj[value] = pathParams[index];
            }
          });            
        }
        var queryParamsStr = window.location.href.substring(idxqp + 1);
        var queryParams = idxqp > 0 ? window.location.href.substring(idxqp + 1).split('&') : [];
        
        if(queryParamsStr.length > 0 && queryParamsStr.startsWith('redirect')) {
          var idxeq = queryParamsStr.indexOf('=');
          queryObj["redirect"] = queryParamsStr.substring(idxeq + 1).replace('&', '?');
        }else{
          queryParams.forEach(value => {
            var kv = value.split("=");
            queryObj[kv[0]] = kv[1];
          });
        }

        Vue.prototype.$queryParams = queryObj;
        Vue.prototype.$currentRoute = pathName;
        console.log("$queryParams",queryObj);
        return route.component;
      }
      return NotFound;
    }
  },

  methods: {
    matchPath(path){
      return this.currentRoute.toLowerCase() === path || this.currentRoute.toLowerCase().startsWith(path + "/") || this.currentRoute.toLowerCase().startsWith(path + "?");
    },
    getRoutePath(){
      for (const path of Object.keys(routes).reverse()) {
        if(this.matchPath(path)){
          return path;
        }
      }
      return null;
    }
  },

  vuetify,
  //render (h) { return h(this.ViewComponent) }
  render (h) { return h(App) }
}).$mount('#app')
