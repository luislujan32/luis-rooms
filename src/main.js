import Vue from 'vue';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import App from './App.vue';
import router from './router';
import store from './store';
import firebaseConfig from './firebase';

Vue.config.productionTip = false;
const app = initializeApp(firebaseConfig);
// Get a reference to the database service
getDatabase(app);

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    this.$store.dispatch('FETCH_USER', { id: store.state.authId });
  },
}).$mount('#app');
