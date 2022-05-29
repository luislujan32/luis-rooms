import Vue from 'vue';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyB2R-8S5XjjZIvqCxTtb-Lbh4HPrn5OslI',
  authDomain: 'platzi-rooms-460f6.firebaseapp.com',
  projectId: 'platzi-rooms-460f6',
  storageBucket: 'platzi-rooms-460f6.appspot.com',
  messagingSenderId: '753980576593',
  appId: '1:753980576593:web:d4d6b0f93589798d72b970',
  measurementId: 'G-5ZME2YH4J8',
};

const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    this.$store.dispatch('FETCH_USER', { id: store.state.authId });
  },
}).$mount('#app');
