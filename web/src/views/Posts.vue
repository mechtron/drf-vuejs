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
      createOrUpdateMode: "create",
      updatedPostIndex: null,
      form: {
        title: null,
        content: null
      }
    }
  },
  methods: {
    createPost(title, content) {
      console.log("Creating a new post with title " + title + " and content " + content);
      var nextId = 0;
      if (this.$store.getters.posts.length > 0) {
        nextId = this.$store.getters.posts[this.$store.getters.posts.length - 1].id + 1;
      }
      this.$store.getters.posts.push({
        id: nextId,
        author: this.$store.getters.user.username,
        dateCreated: new Date().toISOString(),
        title: title,
        content: content,
        likeCount: 0
      });
    },
    likePost(post) {
      console.log("Liking post with ID " + post.id);
      post.likeCount += 1;
    },
    updatePost(postIndex, title, content) {
      var post = this.$store.getters.posts[postIndex];
      console.log("Updating post with ID " + post.id + " to title " + title + " and content " + content);
      post.title = title;
      post.content = content;
    },
    deletePost(postId) {
      console.log("Deleting post with ID " + postId);
      for (var i=0; i<this.$store.getters.posts.length; i++) {
        if (this.$store.getters.posts[i].id == postId) {
          this.$store.getters.posts.splice(i, 1);
          return;
        }
      }
      console.log("Error deleting post with ID " + postId);
    },
    handleCreatePost(evt) {
      evt.preventDefault();
      this.createOrUpdateMode = "create";
      this.showModal();
    },
    handleUpdatePost(postIndex) {
      this.createOrUpdateMode = "update";
      var post = this.$store.getters.posts[postIndex];
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
  }
}
</script>

<style scoped>
</style>
