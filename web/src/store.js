import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

async function getOauthAuthorizeUrl() {
  // axios.get('../api/auth/google/url/')
  // axios.get('localhost:8000/auth/google/url/')
  // .then((response) => {
  //   console.log(response.data);
  //   // this.fields = response.data;
  //   // this.top10 = response.data;
  // })
  // .catch(function(error) {
  //   console.log(error);
  // })
  // .then(function() {
  //   // always executed
  // });
  let res = await axios.get('http://127.0.0.1:8000/auth/google/url/', {
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    crossdomain: true,
  });
  console.log(res.data);
}

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
    getSelf({ commit }, token) {
      return new Promise((resolve, reject) => {
        axios({
          url: '/api/auth/me/',
          data: token,
          method: 'GET'
        })
          .then(resp => {
            const user = resp.data
            commit('LOGIN_SUCCES', {token, user})
            resolve(resp)
          })
          .catch(err => {
            commit('LOGIN_ERROR', err)
            localStorage.removeItem('token')
            reject(err)
          })
      })
    },
    // login({ commit }, oAuthProvider) {
    login(state, oAuthProvider) {
      // return new Promise((resolve, reject) => {
        if (oAuthProvider == 'google') {
          console.log("Logging in via Google..");
          var authorize_url = getOauthAuthorizeUrl();
          console.log(authorize_url);
          // axios({
          //   url: '/api/auth/login/google',
          //   method: 'GET'
          // })
          //   .then(resp => {
          //     const token = resp.data.auth_token
          //     const user = resp.data
          //     localStorage.setItem('token', token)
          //     commit('LOGIN_SUCCES', {token, user})
          //     resolve(resp)
          //   })
          //   .catch(err => {
          //     commit('LOGIN_ERROR', err)
          //     localStorage.removeItem('token')
          //     reject(err)
          //   })
          // })
        } else {
          console.log('Unexpected oAuthProvider: ' + oAuthProvider);
        }
      // })
    },
    // logout({ commit }, oAuthProvider) {
    logout(state, oAuthProvider) {
      console.log(oAuthProvider);
      // return new Promise((resolve, reject) => {
        if (oAuthProvider == 'google') {
          console.log("Logging-out via Google..");
          var authorize_url = getOauthAuthorizeUrl();
          console.log(authorize_url);
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
