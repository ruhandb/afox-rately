<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>
       <v-btn text @click="logout()">
         <span class="mr-2">Logout</span>
         <v-icon>mdi-login-variant</v-icon>
       </v-btn>
    </v-app-bar>

    <v-main>
     
      <component v-bind:is="selectedRoute.component"></component>
    </v-main>
  </v-app>
</template>

<script>
import Vue from 'vue'
//import App from './App.vue'
import Login from './components/Login'
import CreateRate from './components/CreateRate'
import VoteRate from './components/VoteRate'
import { firebase } from './config/firebase'

const routes = {
  //'/': { component: App },
  '/login': { component: Login },
  '/vote': { component: VoteRate, query: ['id'], authRequired: true },
  '/rate/edit': { component: CreateRate, query: ['id'], authRequired: true }
}

const NotFound = { template: '<p>Página não encontrada</p>' }

export default {
  name: 'App',

  components: {
    Login,VoteRate,CreateRate
  },
  mounted() {
    firebase.auth().onAuthStateChanged(user => {
      console.log("user",user);
      var pathName = this.getRoutePath();
      Vue.prototype.$user = user;
      if(!user && routes[pathName] && routes[pathName].authRequired){
        var idxqp = window.location.href.indexOf('?');
        var queryParams = idxqp > 0 ? "&" + window.location.href.substring(idxqp + 1) : "";
        window.location.href = '/login?redirect=' + window.location.pathname + queryParams;
      }
    });

    this.selectedRoute.component = this.ViewComponent();
  },
  methods: {
    logout: () => {
      firebase.auth().signOut();
    },
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
    },
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
  data: () => ({
    selectedRoute : {component:null},
    currentRoute: window.location.pathname
  }),
};
</script>
