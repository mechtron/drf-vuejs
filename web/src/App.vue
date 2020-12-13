<template>
  <div id="app">
    <NavBar/>
    <Home :description="description"/>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import Home from './components/Home.vue'

export default {
  name: 'CRUD-App',
  components: {
    NavBar,
    Home
  },
  data () {
    return {
      description: 'A simple blog post platform'
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 1px;
}
</style>
