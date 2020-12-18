<template>
<div>
  <b-nav align="center">
    <b-nav-item to="/" active>Home</b-nav-item>
    <b-nav-item to="/posts">Posts</b-nav-item>
    <b-nav-item to="/hof">HOF</b-nav-item>
    <b-nav-item to="/about">About</b-nav-item>
    <b-nav-item @click="login('google')" v-if="!$store.getters.user.isLoggedIn">Login</b-nav-item>
    <b-nav-item @click="logout('google')" v-if="$store.getters.user.isLoggedIn">Logout</b-nav-item>
  </b-nav>
</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(["user"])
  },
  data() {
    return {
    }
  },
  methods: {
    ...mapActions([
      'getSelf',
      'login',
      'logout'
    ]),
    detectSession() {
      if (self.user != null && self.user.token != '' && self.user.username != '') {
        console.log("Previous session detected..");
        self.getSelf(self.user.token);
      }
    }
  },
  mounted() {
    this.detectSession();
  }
}
</script>

<style scoped>
</style>
