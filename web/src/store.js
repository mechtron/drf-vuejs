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
    posts: [],
    postsPagination: {
      nextPage: '',
      allPagesLoaded: false
    }
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
      state.posts.unshift(post);
    },
    REFRESH_POSTS(state, posts) {
      state.posts = posts;
    },
    ADD_PAGE_OF_POSTS(state, posts) {
      state.posts.push(...posts);
    },
    LIKE_POST(state, post) {
      post.like_count += 1;
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
    },
    ALL_POSTS_LOADED(state) {
      state.postsPagination.allPagesLoaded = true
    }
  },
  actions: {
    login(state, oAuthProvider) {
      var oAuthRedirectUrl = ''
      if (oAuthProvider == 'google') {
        console.log("Logging in via Google..")
        let web_hostname = location.protocol + '//' + location.hostname + (location.port ? ':'+location.port: '')
        let client_id = '890243898486-olm14s1qrk5vlbhofbq0skql2hst4j2a.apps.googleusercontent.com'
        let scope = 'email+profile'
        let access_type = 'offline'
        oAuthRedirectUrl = (
          `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=` +
          `${web_hostname}/auth/google/&prompt=consent&response_type=code&client_id=${client_id}` +
          `&scope=${scope}&access_type=${access_type}`
        )
      } else {
        console.log('Unexpected oAuthProvider: ' + oAuthProvider)
        return
      }
      window.location = oAuthRedirectUrl
    },
    logout({ commit, state }, oAuthProvider) {
      if (oAuthProvider == 'google') {
        console.log("Logging-out via Google..");
        axios({
          url: '/auth/logout/',
          method: 'POST',
          headers: {'Authorization': `Token ${state.user.token}`}
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
      axios('/auth/user/', {
        headers: {'Authorization': `Token ${state.user.token}`}
      })
        .then(resp => {
          commit('UPDATE_SELF', resp.data.username)
        })
        .catch(err => {
          console.log(`Error looking-up self: ${err}`)
        })
    }
  },
  getters: {
    user: state => state.user,
    posts: state => state.posts,
    postsPagination: state => state.postsPagination
  },
  plugins: [
    createPersistedState({
      paths: ['user']
    })
  ]
})
