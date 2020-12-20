import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    user: {
      isLoggedIn: false,
      username: '',
      token: localStorage.getItem('token') || '',
    },
    posts: []
  },
  mutations: {
    LOGIN_SUCCESSS(state, token, user) {
      state.status = 'success';
      state.user.isLoggedIn = true;
      state.user.token = token;
      state.user.username = user.username;
    },
    LOGIN_ERROR(state) {
      state.status = 'error';
    },
    LOGOUT(state) {
      state.status = '';
      state.user.token = '';
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
          state.posts.splice(i, 1);
          return;
        }
      }
      console.log("Error deleting post with ID " + postId);
    }
  },
  actions: {
    getSelf({ commit }, token) {
      return new Promise((resolve, reject) => {
        axios({
          url: '/api/auth/me/',
          data: token,
          method: 'GET'
        })
          .then(resp => {
            const user = resp.data
            commit('LOGIN_SUCCESS', {token, user})
            resolve(resp)
          })
          .catch(err => {
            commit('LOGIN_ERROR', err)
            localStorage.removeItem('token')
            reject(err)
          })
      })
    },
    login(state, oAuthProvider) {
      if (oAuthProvider == 'google') {
        console.log("Logging in via Google..");
        window.location = "http://127.0.0.1:8000/auth/google/url/";
      } else {
        console.log('Unexpected oAuthProvider: ' + oAuthProvider);
      }
    },
    // logout({ commit }, oAuthProvider) {
    logout(state, oAuthProvider) {
      // return new Promise((resolve, reject) => {
        if (oAuthProvider == 'google') {
          console.log("Logging-out via Google..");
          // axios({
          //   url: '/api/auth/logout',
          //   data: user,
          //   method: 'POST'
          // })
          //   .then(resp => {
          //     commit('LOGOUT')
          //     const token = resp.data.auth_token
          //     localStorage.removeItem('token', token)
          //     resolve(resp)
          //   })
          //   .catch(err => {
          //     reject(err)
          //   })
          // })
        } else {
          console.log('Unexpected oAuthProvider: ' + oAuthProvider);
        }
      // })
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
