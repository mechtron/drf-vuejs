<template>
  <div>
    <b-container>
      <b-row>
        <b-col></b-col>
        <b-col> 
          <h3>Posts</h3>
        </b-col>
        <b-col>
          <b-button variant="success" @click="handleCreatePost">
            <b-icon icon="plus"></b-icon>
          </b-button>
        </b-col>
      </b-row>
      <br/>
      <b-row>
        <b-col></b-col>
        <b-col cols="10"> 
          <div v-for="(item, index) in posts" :key="item.id">
            <b-card :title="item.title" :sub-title="item.content">
              <b-card-text>
                Posted {{getTimeSince(item.dateCreated)}} ago by {{item.author}}
              </b-card-text>
              <b-row>
                <b-col>
                  <b-button id="delete-button" class="mr-1" variant="danger" @click="handleDeletePost(index)"><b-icon icon="trash"></b-icon></b-button>
                  <b-button id="update-button" class="mr-1" variant="warning" @click="handleUpdatePost(index)"><b-icon icon="pencil"></b-icon></b-button>
                </b-col>
                <b-col>
                  <b-button class="mr-1" variant="primary" @click="likePost(item.id)">
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
export default {
  computed: {
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
      create_or_update_mode: "create",
      updated_post_id: null,
      user_is_logged_in: true,
      user_logged_in: "mechtron",
      posts: [
        {
          id: 1,
          author: "admin",
          dateCreated: "2020-11-21T23:30:00.000Z",
          title: "First!!!1one",
          content: "First post is the best post",
          like_count: 2
        },
        {
          id: 2,
          author: "mechtron",
          dateCreated: "2020-12-03T23:45:00.000Z",
          title: "Best post ever",
          content: "The meaning of life will blow your mind",
          like_count: 3
        }
      ],
      form: {
        title: null,
        content: null
      }
    }
  },
  methods: {
    createPost(title, content) {
      console.log("Creating a new post with title " + title + " and content " + content);
      this.resetModal();
      this.showModal();
    },
    likePost(postId) {
      console.log("Liking post with ID " + postId);
    },
    updatePost(postId, title, content) {
      console.log("Updating post with ID " + postId + " to title " + title + " and content " + content);
    },
    deletePost(postId) {
      console.log("Deleting post with ID " + postId);
    },
    handleCreatePost(evt) {
      evt.preventDefault();
      this.create_or_update_mode = "create";
      this.showModal();
    },
    handleUpdatePost(postIndex) {
      this.create_or_update_mode = "update";
      var post = this.posts[postIndex];
      this.updated_post_id = postIndex;
      this.form.title = post.title;
      this.form.content = post.content;
      this.showModal();
    },
    handleDeletePost(postIndex) {
      var postId = this.posts[postIndex].id;
      // TODO: confirm deletion
      this.deletePost(postId);
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
      if (this.create_or_update_mode == "create") {
        this.createPost(this.form.title, this.form.content);
      } else { // update mode
        this.updatePost(this.updated_post_id, this.form.title, this.form.content);
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
      return this.create_or_update_mode == "create" ? "Create" : "Update";
    }
  }
}
</script>

<style scoped>
</style>
