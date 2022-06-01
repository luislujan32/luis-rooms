import Vue from 'vue';
import Vuex from 'vuex';
import {
  getDatabase, ref, onValue, query, limitToFirst, child, get, push, update, set,
} from 'firebase/database';
import {
  getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut,
} from 'firebase/auth';
import countObjectProperties from './utils';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    users: {},
    services: {},
    rooms: {},
    authId: null,
    modals: {
      login: false,
      register: false,
    },
  },
  mutations: {
    SET_MODAL_STATE: (state, { name, value }) => {
      state.modals[name] = value;
    },
    SET_ROOM(state, { newRoom, roomId }) {
      Vue.set(state.rooms, roomId, newRoom);
    },
    APPEND_ROOM_TO_USER(state, { roomId, userId }) {
      Vue.set(state.users[userId].rooms, roomId, roomId);
    },
    SET_ITEM(state, { item, id, resource }) {
      const newItem = item;
      newItem['.key'] = id;
      Vue.set(state[resource], id, newItem);
    },
    SET_AUTHID(state, id) {
      state.authId = id;
    },
  },
  actions: {
    TOGGLE_MODAL_STATE: ({ commit }, { name, value }) => {
      commit('SET_MODAL_STATE', { name, value });
    },
    CREATE_ROOM: ({ state, commit }, room) => {
      const db = getDatabase();
      const newRoom = room;
      const roomId = push(child(ref(db), 'rooms')).key;
      newRoom.userId = state.authId;
      newRoom.publishedAt = Math.floor(Date.now() / 1000);
      newRoom.meta = { likes: 0 };

      const updates = {};
      updates[`rooms/${roomId}`] = newRoom;
      updates[`users/${newRoom.userId}/rooms/${roomId}`] = roomId;
      update(ref(db), updates).then(() => {
        commit('SET_ROOM', { newRoom, roomId });
        commit('APPEND_ROOM_TO_USER', { roomId, userId: newRoom.userId });
        return Promise.resolve(state.rooms[roomId]);
      });
    },
    FETCH_ROOMS: ({ state, commit }, limit) => new Promise((resolve) => {
      let instance = ref(getDatabase(), 'rooms');
      if (limit) {
        instance = query(instance, limitToFirst(limit));
      }
      onValue(instance, (snapshot) => {
        const rooms = snapshot.val();
        Object.keys(rooms).forEach((roomId) => {
          const room = rooms[roomId];
          commit('SET_ITEM', { resource: 'rooms', id: roomId, item: room });
        });
        resolve(Object.values(state.rooms));
      });
    }),
    FETCH_SERVICES: ({ state, commit }) => new Promise((resolve) => {
      const instance = ref(getDatabase(), 'services');

      onValue(instance, (snapshot) => {
        const services = snapshot.val();
        Object.keys(services).forEach((serviceId) => {
          const service = services[serviceId];
          commit('SET_ITEM', { resource: 'services', id: serviceId, item: service });
        });
        resolve(Object.values(state.services));
      });
    }),
    FETCH_USER: ({ state, commit }, { id }) => new Promise((resolve) => {
      const dbRef = ref(getDatabase());
      get(child(dbRef, `users/${id}`)).then((snapshot) => {
        commit('SET_ITEM', { resource: 'users', id: snapshot.key, item: snapshot.val() });
        resolve(state.users[id]);
      });
    }),
    CREATE_USER: ({ state, commit }, { email, name, password }) => new Promise((resolve) => {
      createUserWithEmailAndPassword(getAuth(), email, password).then((userCredential) => {
        const id = userCredential.user.uid;
        const registeredAt = Math.floor(Date.now() / 1000);
        const newUser = { email, name, registeredAt };

        // const updates = {};
        // updates[`users/${id}`] = newUser;
        // update(ref(getDatabase()), updates).then(() => {
        //   commit('SET_ITEM', { resource: 'users', id, item: newUser });
        //   resolve(state.users[id]);
        // });
        const dbRef = ref(getDatabase());
        set(child(dbRef, `users/${id}`), newUser).then(() => {
          commit('SET_ITEM', { resource: 'users', id, item: newUser });
          resolve(state.users[id]);
        });
      });
    }),
    // ////////////////
    // CREATE_USER_OLD: ({ state, commit }, { email, name, password }) => new Promise((resolve) => {
    //   firebase.auth().createUserWithEmailAndPassword(email, password).then((account) => {
    //     const id = account.user.uid;
    //     const registeredAt = Math.floor(Date.now() / 1000);
    //     const newUser = { email, name, registeredAt };
    //     firebase.database().ref('users').child(id).set(newUser)
    //       .then(() => {
    //         commit('SET_ITEM', { resource: 'users', id, item: newUser });
    //         resolve(state.users[id]);
    //       });
    //   });
    // }),
    // ////////////////
    FETCH_AUTH_USER: ({ dispatch, commit }) => {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        const userId = user.uid;
        return dispatch('FETCH_USER', { id: userId })
          .then(() => {
            commit('SET_AUTHID', userId);
          });
      });
    },
    SIGN_IN(context, { email, password }) {
      return signInWithEmailAndPassword(getAuth(), email, password);
    },
    LOG_OUT({ commit }) {
      signOut(getAuth()).then(() => {
        commit('SET_AUTHID', null);
      });
    },
  },
  getters: {
    modals: state => state.modals,
    authUser(state) {
      return (state.authId) ? state.users[state.authId] : null;
    },
    rooms: state => state.rooms,
    services: state => state.services,
    userRoomsCount: state => id => countObjectProperties(state.users[id].rooms),
  },
});
