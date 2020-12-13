<template>
  <div class="home">
    <b-jumbotron header="CRUD App" :lead="description">
      <hr class="my-4">
      <p>Check out my project on GitHub:</p>
      <b-button variant="primary" href="https://github.com/mechtron/drf-vuejs" target="_blank">mechtron/drf-vuejs</b-button>
    </b-jumbotron>
  </div>
</template>

<script>
export default {
  data () {
    return {
      example: 'test'
    }
  },
  props: {
    description: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
