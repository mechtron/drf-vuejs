<template>
  <div>
    <b-container class="bv-example-row">
      <b-row>
        <b-col></b-col>
        <b-col> 
          <h3>Popular Posts</h3>
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
            <b-card :title="item.title">
              <b-card-text>
                {{item.content}}
              </b-card-text>
              <b-button variant="primary" @click="likePost(item.id)">
                <b-badge variant="light">{{item.like_count}}</b-badge> Like
              </b-button>
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
          dateCreated: "2020-12-13T23:30:00.000Z",
          title: "Test title",
          content: "First",
          like_count: 2
        },
        {
          id: 2,
          dateCreated: "2020-12-13T23:45:00.000Z",
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
    }
  }
}
</script>

<style scoped>
</style>
