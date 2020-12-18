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
                Posted {{getTimeSince(item.dateCreated)}} ago by {{item.author}}
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
                    <b-badge variant="light">{{item.likeCount}}</b-badge>
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
      :title="modePretty() + ' post'"
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
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapGetters(["user", "posts"]),
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
      'CREATE_POST',
      'DELETE_POST',
      'LIKE_POST',
      'REFRESH_POSTS',
      'UPDATE_POST'
    ]),
    getPosts() {
      console.log("Getting posts..");
      var posts = [
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
      this.REFRESH_POSTS(posts);
      // return new Promise((resolve, reject) => {
      //   axios({
      //     url: '/api/posts',
      //     method: 'GET'
      //   })
      //     .then(resp => {
      //       this.REFRESH_POSTS(resp.data.posts)
      //       resolve(resp);
      //     })
      //     .catch(err => {
      //       console.log("Error getting posts: " + err)
      //       reject(err);
      //     })
      // })
    },
    createPost(title, content) {
      console.log("Creating a new post with title " + title + " and content " + content);
      var nextId = 0;
      if (this.posts.length > 0) {
        nextId = this.posts[this.posts.length - 1].id + 1;
      }
      var post = {
        id: nextId,
        author: this.user.username,
        dateCreated: new Date().toISOString(),
        title: title,
        content: content,
        likeCount: 0
      }
      this.CREATE_POST(post);
      // return new Promise((resolve, reject) => {
      //   axios({
      //     url: '/api/posts',
      //     data: user,
      //     method: 'POST'
      //   })
      //     .then(resp => {
      //       this.CREATE_POST(resp.data.post);
      //       resolve(resp);
      //     })
      //     .catch(err => {
      //       reject(err);
      //     })
      // })
    },
    likePost(post) {
      console.log("Liking post with ID " + post.id);
      this.LIKE_POST(post);
      // return new Promise((resolve, reject) => {
      //   axios({
      //     url: '/api/likepost/' + post.id,
      //     data: user,
      //     method: 'PUT'
      //   })
      //     .then(resp => {
      //       this.LIKE_POST(resp.data.post);
      //       resolve(resp);
      //     })
      //     .catch(err => {
      //       reject(err);
      //     })
      // })
    },
    updatePost(postIndex, title, content) {
      var post = this.posts[postIndex];
      console.log("Updating post with ID " + post.id + " to title " + title + " and content " + content);
      this.UPDATE_POST({ post, title, content });
      // var data = {title: title, content: content};
      // return new Promise((resolve, reject) => {
      //   axios({
      //     url: '/api/posts/' + post.id,
      //     data: data,
      //     method: 'PUT'
      //   })
      //     .then(resp => {
      //       this.UPDATE_POST(resp.data.post);
      //       resolve(resp);
      //     })
      //     .catch(err => {
      //       reject(err);
      //     })
      // })
    },
    deletePost(postId) {
      console.log("Deleting post with ID " + postId);
      this.DELETE_POST(postId);
      // return new Promise((resolve, reject) => {
      //   axios({
      //     url: '/api/posts/' + postId,
      //     method: 'DELETE'
      //   })
      //     .then(resp => {
      //       this.DELETE_POST(resp.data.postId);
      //       resolve(resp);
      //     })
      //     .catch(err => {
      //       reject(err);
      //     })
      // })
    },
    refreshPostsIfEmpty() {
      if (this.posts.length == 0) {
        this.getPosts();
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
      this.$bvModal.msgBoxConfirm('Are you sure that you want to delete the post with title "' + post.title + '"', {
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
        console.log(err);
      })
    },
    getTimeSince(date_string) {
      var date = Date.parse(date_string);
      var seconds = Math.floor((new Date() - date) / 1000);
      var interval = seconds / 31536000;
      if (interval > 1) {
        return Math.floor(interval) + " years";
      }
      interval = seconds / 2592000;
      if (interval > 1) {
        return Math.floor(interval) + " months";
      }
      interval = seconds / 86400;
      if (interval > 1) {
        return Math.floor(interval) + " days";
      }
      interval = seconds / 3600;
      if (interval > 1) {
        return Math.floor(interval) + " hours";
      }
      interval = seconds / 60;
      if (interval > 1) {
        return Math.floor(interval) + " minutes";
      }
      return Math.floor(seconds) + " seconds";
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
    modePretty() {
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
