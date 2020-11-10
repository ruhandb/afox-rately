

import Vue from 'vue'
import App from './App.vue'
//import { firebase } from './config/firebase'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render (h) { return h(App) }
}).$mount('#app')
