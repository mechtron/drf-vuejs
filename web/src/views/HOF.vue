<template>
  <div id="hof">
    <b-container>
      <b-row>
        <b-col></b-col>
        <b-col> 
          <h3>HOF</h3>
        </b-col>
        <b-col></b-col>
      </b-row>
      <b-row>
        <b-col></b-col>
        <b-col cols="10"> 
          <div v-for="(item, index) in hofPosts" :key="item.id">
            <b-card :header="getPlacePretty(index)" :title="item.title" :sub-title="item.content">
              <b-card-text>
                Posted {{getTimeSince(item.date_created)}} ago by {{item.author}}
              </b-card-text>
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
import axios from 'axios'
import common from '../common'
export default {
  data () {
    return {
      hofPosts: []
    }
  },
  methods: {
    getTimeSince: common.getTimeSince,
    getHofPosts() {
      console.log("Getting HOF posts..");
      return new Promise((resolve, reject) => {
      axios('/hof')
        .then(resp => {
          this.hofPosts = resp.data
          resolve(resp)
        })
        .catch(err => {
          console.log(`Error getting HOF posts: ${err}`)
          reject(err)
        })
      })
    },
    getPlacePretty(postIndex) {
      if (postIndex == 0) {
        return `🏆`
      } else {
        return `#${postIndex+1}`
      }
    }
  },
  mounted: function () {
    this.getHofPosts()
  }
}
</script>

<style scoped>
</style>
