<template>
<div>
  <b-nav align="center">
    <b-nav-item to="/" active>Home</b-nav-item>
    <b-nav-item to="/posts">Posts</b-nav-item>
    <b-nav-item to="/hof">HOF</b-nav-item>
    <b-nav-item to="/about">About</b-nav-item>
    <b-nav-item @click="oAuthLogin('google')">Login</b-nav-item>
  </b-nav>
</div>
</template>

<script>
// import { store, mutations } from "./store";
import oauth from '../oauth';
export default {
  // computed: {
  //   newsletters() {
  //     return store.newsletters;
  //   }
  // },
  data() {
    return {
      show: true
    }
  },
  methods: {
    // setNewsletter: mutations.setNewsletter,
    oAuthLogin(provider) {
      oauth.login(provider);
    }
  }
  // ,
  // mounted() {
  //   this.updateFormFields()
  // }
}
</script>

<style scoped>
</style>
