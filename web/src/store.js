import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    user: {
      isLoggedIn: true,
      username: "mechtron",
      token: localStorage.getItem('token') || '',
    },
    posts: []
  },
  mutations: {
    LOGIN_SUCCES(state, token, user) {
      state.status = 'success';
      state.user.token = token;
      state.user.username = user;
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
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        axios({
          url: '/api/auth/login/google',
          data: user,
          method: 'POST'
        })
          .then(resp => {
            const token = resp.data.auth_token
            const user = resp.data
            localStorage.setItem('token', token)
            commit('LOGIN_SUCCES', token)
            commit('LOGIN_SUCCES', user)
            resolve(resp)
          })
          .catch(err => {
            commit('LOGIN_ERROR', err)
            localStorage.removeItem('token')
            reject(err)
          })
      })
    },
    logout({ commit }, user) {
      return new Promise((resolve, reject) => {
        axios({
          url: '/api/auth/logout',
          data: user,
          method: 'POST'
        })
          .then(resp => {
            commit('LOGOUT')
            const token = resp.data.auth_token
            localStorage.removeItem('token', token)
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
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
