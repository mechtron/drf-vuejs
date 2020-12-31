<template>
  <div>
    <b-container>
      <b-row>
        <b-col></b-col>
        <b-col> 
          <h3>Posts</h3>
        </b-col>
        <b-col>
          <b-button variant="success" @click="handleCreatePost" v-if="$store.getters.user.isLoggedIn">
            <b-icon icon="plus"></b-icon>
          </b-button>
        </b-col>
      </b-row>
      <br/>
      <b-row>
        <b-col></b-col>
        <b-col cols="10"> 
          <div v-for="(item, index) in $store.getters.posts" :key="item.id">
            <b-card :title="item.title" :sub-title="item.content">
              <b-card-text>
                Posted {{getTimeSince(item.date_created)}} ago by {{item.author}}
              </b-card-text>
              <b-row>
                <b-col>
                  <div v-if="item.author == $store.getters.user.username" >
                    <b-button id="delete-button" class="mr-1" variant="danger" @click="handleDeletePost(item)"><b-icon icon="trash"></b-icon></b-button>
                    <b-button id="update-button" class="mr-1" variant="warning" @click="handleUpdatePost(index)"><b-icon icon="pencil"></b-icon></b-button>
                  </div>
                </b-col>
                <b-col>
                  <b-button class="mr-1" variant="primary" @click="likePost(item)">
                    <b-badge variant="light">{{item.like_count}}</b-badge>
                    Nice <b-icon icon="hand-thumbs-up"></b-icon>
                  </b-button>
                </b-col>
              </b-row>
            </b-card>
            <br/>
          </div>
        </b-col>
        <b-col></b-col>
      </b-row>
    </b-container>
    <b-modal centered
      id="create-update-modal"
      ref="modal"
      :title="getModePretty() + ' post'"
      ok-title="Submit"
      @hidden="resetModal"
      @ok="handleSubmit"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Title"
          label-for="input-title"
          invalid-feedback="Title is required"
        >
          <b-form-input
            id="input-title"
            type="text"
            v-model="form.title"
            :state="formTitleLength"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Post content"
          label-for="input-content"
          invalid-feedback="Content is required"
        >
          <b-form-input
            id="input-content"
            v-model="form.content"
            :state="formContentLength"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
    <div v-infinite-scroll="loadMorePosts"
      infinite-scroll-immediate-check="false"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="10"
      infinite-scroll-throttle-delay="1000"
    ></div>
    <b-spinner label="Loading more posts..." v-if="busy"></b-spinner>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters, mapMutations } from 'vuex'
import common from '../common'
export default {
  computed: {
    ...mapGetters(["user", "posts", "postsPagination"]),
    formTitleLength() {
      if (this.form.title == null) {
        return false;
      }
      return this.form.title.length > 2 ? true : false;
    },
    formContentLength() {
      if (this.form.content == null) {
        return false;
      }
      return this.form.content.length > 5 ? true : false;
    }
  },
  data () {
    return {
      busy: false,
      createOrUpdateMode: "create",
      updatedPostIndex: null,
      form: {
        title: null,
        content: null
      }
    }
  },
  methods: {
    ...mapMutations([
      'ADD_PAGE_OF_POSTS',
      'ALL_POSTS_LOADED',
      'CREATE_POST',
      'DELETE_POST',
      'LIKE_POST',
      'REFRESH_POSTS',
      'UPDATE_POST'
    ]),
    getTimeSince: common.getTimeSince,
    getPosts() {
      console.log("Getting posts..");
      return new Promise((resolve, reject) => {
        axios('/posts')
          .then(resp => {
            this.REFRESH_POSTS(resp.data.results)
            this.postsPagination.nextPage = resp.data.next
            resolve(resp)
          })
          .catch(err => {
            console.log(`Error getting posts: ${err}`)
            reject(err)
          })
      })
    },
    loadMorePosts: function() {
      if (this.postsPagination.allPagesLoaded == false) {
        this.busy = true
      }
      setTimeout(() => {
        return new Promise((resolve, reject) => {
          if (this.postsPagination.nextPage != '' && this.postsPagination.nextPage != null) {
            console.log("Getting more posts..")
            axios(this.postsPagination.nextPage)
              .then(resp => {
                this.busy = false
                this.ADD_PAGE_OF_POSTS(resp.data.results)
                if (resp.data.next == null) {
                  this.ALL_POSTS_LOADED()
                  this.postsPagination.nextPage = ''
                } else {
                  this.postsPagination.nextPage = resp.data.next
                }
                resolve()
              })
              .catch(err => {
                this.busy = false
                if (err.response.status == 404) {
                  console.log("You've reached the end of the road")
                  this.ALL_POSTS_LOADED()
                  resolve()
                } else {
                  console.log(`Error getting more posts: ${err}`)
                  reject(err)
                }
              })
          } else {
            console.log("There's nothing more to know")
            this.busy = false
            resolve()
          }
        })
      }, 1000);
    },
    createPost(title, content) {
      console.log(`Creating a new post with title ${title} and content ${content}`);
      return new Promise((resolve, reject) => {
        axios({
          url: '/post',
          method: 'POST',
          headers: {'Authorization': `Token ${this.user.token}`},
          data: {title: title, content: content}
        })
          .then(resp => {
            this.CREATE_POST(resp.data)
            resolve(resp)
          })
          .catch(err => {
            console.log(`Error creating post: ${err}`)
            reject(err)
          })
      })
    },
    likePost(post) {
      console.log(`Liking post with ID ${post.id}`);
      return new Promise((resolve, reject) => {
        axios(`/like/${post.id}/`)
          .then(resp => {
            this.LIKE_POST(post)
            resolve(resp)
          })
          .catch(err => {
            console.log(err)
            console.log(`Error liking post: ${err}`)
            reject(err)
          })
      })
    },
    updatePost(postIndex, title, content) {
      let post = this.posts[postIndex]
      console.log(`Updating post with ID ${post.id} to title ${title} and content ${content}`)
      return new Promise((resolve, reject) => {
        axios({
          url: `/post/${post.id}/`,
          method: 'PUT',
          headers: {'Authorization': `Token ${this.user.token}`},
          data: {title: title, content: content}
        })
          .then(resp => {
            this.UPDATE_POST({ post, title, content })
            resolve(resp)
          })
          .catch(err => {
            console.log(`Error updating post: ${err}`)
            reject(err)
          })
      })
    },
    deletePost(postId) {
      console.log(`Deleting post with ID ${postId}`);
      return new Promise((resolve, reject) => {
        axios({
          url: `/post/${postId}/`,
          method: 'DELETE',
          headers: {'Authorization': `Token ${this.user.token}`},
        })
          .then(resp => {
            this.DELETE_POST(postId)
            resolve(resp)
          })
          .catch(err => {
            console.log(`Error deleting post: ${err}`)
            reject(err)
          })
      })
    },
    refreshPostsIfEmpty() {
      if (this.posts.length == 0) {
        this.getPosts()
      }
    },
    handleCreatePost(evt) {
      evt.preventDefault();
      this.createOrUpdateMode = "create";
      this.showModal();
    },
    handleUpdatePost(postIndex) {
      this.createOrUpdateMode = "update";
      var post = this.posts[postIndex];
      this.updatedPostIndex = postIndex;
      this.form.title = post.title;
      this.form.content = post.content;
      this.showModal();
    },
    handleDeletePost(post) {
      this.$bvModal.msgBoxConfirm(`Are you sure that you want to delete the post with title "${post.title}"?`, {
        title: 'Confirm deletion',
        okVariant: 'danger',
        okTitle: 'Yes',
        cancelTitle: 'No',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
      .then(value => {
        if (value) {
          this.deletePost(post.id);
        }
      })
      .catch(err => {
        console.log(`Error deleting post: ${err}`)
      })
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      return valid;
    },
    resetModal() {
      this.form.title = null;
      this.form.content = null;
    },
    handleSubmit(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return
      }
      // Create or edit the post
      if (this.createOrUpdateMode == "create") {
        this.createPost(this.form.title, this.form.content);
      } else { // update mode
        this.updatePost(this.updatedPostIndex, this.form.title, this.form.content);
      }
      // Hide the modal manually
      this.$nextTick(() => {
        this.hideModal();
      })
    },
    hideModal() {
      this.$bvModal.hide('create-update-modal');
    },
    showModal() {
      this.$bvModal.show('create-update-modal');
    },
    toggleModal() {
      this.$bvModal.toggle('create-update-modal');
    },
    getModePretty() {
      return this.createOrUpdateMode == "create" ? "Create" : "Update";
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      // Code that will run only after the entire view has been rendered
      this.refreshPostsIfEmpty();
    })
  }
}
</script>

<style scoped>
</style>
