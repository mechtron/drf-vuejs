import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      isLoggedIn: true,
      username: "mechtron"
    },
    posts: [
      {
        id: 1,
        author: "admin",
        dateCreated: "2020-11-21T23:30:00.000Z",
        title: "First!!!1one",
        content: "First post is the best post",
        likeCount: 2
      },
      {
        id: 2,
        author: "mechtron",
        dateCreated: "2020-12-03T23:45:00.000Z",
        title: "Best post ever",
        content: "The meaning of life will blow your mind",
        likeCount: 3
      }
    ]
  },
  mutations: {
  },
  getters: {
    user: state => state.user,
    posts: state => state.posts
  }
})
