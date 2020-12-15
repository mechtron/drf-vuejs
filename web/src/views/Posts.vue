<template>
  <div>
    <b-container>
      <b-row>
        <b-col></b-col>
        <b-col> 
          <h3>Posts</h3>
        </b-col>
        <b-col>
          <b-button variant="success" @click="createPost">
            <b-icon icon="plus"></b-icon>
          </b-button>
        </b-col>
      </b-row>
      <br/>
      <b-row>
        <b-col></b-col>
        <b-col cols="10"> 
          <div v-for="(item) in posts" :key="item.id">
            <b-card :title="item.title" :sub-title="item.content">
              <b-card-text>
                Posted {{getTimeSince(item.dateCreated)}} ago by {{item.author}}
              </b-card-text>
              <b-row>
                <b-col>
                  <b-button id="delete-button" class="mr-1" variant="danger" @click="deletePost(item.id)"><b-icon icon="trash"></b-icon></b-button>
                  <b-button id="update-button" class="mr-1" variant="warning" @click="updatePost(item.id)"><b-icon icon="pencil"></b-icon></b-button>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
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
      ]
    }
  },
  props: {
    example2: String
  },
  methods: {
    createPost(evt) {
      evt.preventDefault();
      console.log("Creating new post!")
    },
    likePost(postId) {
      console.log("Liking post with ID " + postId);
    },
    updatePost(postId) {
      console.log("Updating post with ID " + postId);
    },
    deletePost(postId) {
      console.log("Deleting post with ID " + postId);
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
    }
  }
}
</script>

<style scoped>
</style>
