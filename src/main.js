import Vue from 'vue';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import App from './App.vue';
import router from './router';
import store from './store';
import firebaseConfig from './firebase';

Vue.config.productionTip = false;
const app = initializeApp(firebaseConfig);
// Get a reference to the database service
getDatabase(app);

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    store.dispatch('FETCH_AUTH_USER');
  }
});

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    if (store.state.authId) {
      this.$store.dispatch('FETCH_USER', { id: store.state.authId });
    }
  },
}).$mount('#app');
