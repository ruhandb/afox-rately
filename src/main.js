import Vue from 'vue'
//import VueRouter from 'vue-router'
import App from './App.vue'
import Login from './components/Login'
import CreateRate from './components/CreateRate'
import firebase from './config/firebase'

const NotFound = { template: '<p>Página não encontrada</p>' }

Vue.config.productionTip = false;

const routes = {
  '/': { component: App },
  '/login': { component: Login },
  '/rate/edit': { component: CreateRate, query: ['id'], authRequired: true }
}
new Vue({
  data: {
    currentRoute: window.location.pathname,
    route: routes['/']
  },
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      console.log("user",user);
      var pathName = "";
      for (const path of Object.keys(routes).reverse()) {
        if(this.currentRoute.toLowerCase() === path || this.currentRoute.toLowerCase().startsWith(path + "/") || this.currentRoute.toLowerCase().startsWith(path + "?")){
          pathName = path;
        }
      }
      if(!user && routes[pathName].authRequired){
        var idxqp = window.location.href.indexOf('?');
        var queryParams = idxqp > 0 ? "&" + window.location.href.substring(idxqp + 1) : "";
        window.location.href = '/login?redirect=' + window.location.pathname + queryParams;
      }
    });
  },
  computed: {
    ViewComponent () {
      for (const path of Object.keys(routes).reverse()) {        
        const route = routes[path];
        if(this.currentRoute.toLowerCase() === path || this.currentRoute.toLowerCase().startsWith(path + "/") || this.currentRoute.toLowerCase().startsWith(path + "?")){
          var queryObj = {}
          var idxqp = window.location.href.indexOf('?');
          if(route.query) {
            var pathParams = this.currentRoute === path ? "" : this.currentRoute.substring(path.length + 1, idxqp < 0 ? this.currentRoute.length : idxqp).split('/');
            console.log("pathParams",pathParams);
            route.query.forEach((value, index) => {
              queryObj[value] = pathParams[index];
            });            
          }
          var queryParamsStr = window.location.href.substring(idxqp + 1);
          var queryParams = idxqp > 0 ? window.location.href.substring(idxqp + 1).split('&') : [];
          console.log("queryParams",queryParams);
          
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
          Vue.prototype.$currentRoute = path;
          console.log("$queryParams",queryObj);

          /* console.log(route.authRequired, this.isAuthenticated);
          if(route.authRequired && !this.isAuthenticated){
           // return Login;
          } */
          return route.component;
        }
      }  
      return NotFound;
    }
  },
  render (h) { return h(this.ViewComponent) }
}).$mount('#app')
