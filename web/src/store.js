import axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

import router from './router';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      isLoggedIn: false,
      username: '',
      token: localStorage.getItem('token') || '',
    },
    posts: []
  },
  mutations: {
    LOGIN_SUCCESS(state, token) {
      state.user.isLoggedIn = true;
      state.user.token = token;
    },
    UPDATE_SELF(state, username) {
      state.user.username = username;
    },
    LOGIN_ERROR(state) {
      state.user.isLoggedIn = false;
      state.user.token = '';
      state.user.username = '';
    },
    LOGOUT(state) {
      state.user.isLoggedIn = false;
      state.user.token = '';
      state.user.username = '';
    },
    CREATE_POST(state, post) {
      state.posts.push(post);
    },
    REFRESH_POSTS(state, posts) {
      state.posts = posts;
    },
    LIKE_POST(state, post) {
      post.likeCount += 1;
    },
    UPDATE_POST(state, { post, title, content }) {
      post.title = title;
      post.content = content;
    },
    DELETE_POST(state, postId) {
      for (var i=0; i<state.posts.length; i++) {
        if (state.posts[i].id == postId) {
          state.posts.splice(i, 1)
          return
        }
      }
      console.log("Error deleting post with ID " + postId)
    }
  },
  actions: {
    login(state, oAuthProvider) {
      if (oAuthProvider == 'google') {
        console.log("Logging in via Google..")
        window.location = "http://127.0.0.1:8000/auth/google/url/"
      } else {
        console.log('Unexpected oAuthProvider: ' + oAuthProvider)
      }
    },
    logout({ commit, state }, oAuthProvider) {
      if (oAuthProvider == 'google') {
        console.log("Logging-out via Google..");
        axios({
          url: 'http://127.0.0.1:8000/auth/logout/',
          method: 'POST',
          headers: {
            'Authorization': `Token ${state.user.token}`
          }
        })
          .then(resp => {
            console.log(`Logout result: ${resp.data.detail}`)
            commit('LOGOUT')
            router.push("/")
          })
          .catch(err => {
            console.log("Error logging out: " + err)
            router.push("/")
          })
      } else {
        console.log(`Unexpected OAuth provider: ${oAuthProvider}`)
      }
    },
    getSelf({ commit, state }) {
      axios('http://127.0.0.1:8000/auth/user/', {
        headers: {
          'Authorization': `Token ${state.user.token}`
        }
      })
        .then(resp => {
          commit('UPDATE_SELF', resp.data.username)
        })
        .catch(err => {
          console.log(`Error looking-up self: ${err}`)
        })
    },
    getPosts() {
    }
  },
  getters: {
    user: state => state.user,
    posts: state => state.posts
  },
  plugins: [
    createPersistedState({
      paths: ['user']
    })
  ]
})
