<template>
  <div>
    <b-spinner label="Loading..."></b-spinner>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapGetters(["user"])
  },
  data () {
    return {
    }
  },
  methods: {
    ...mapActions([
      'getSelf'
    ]),
    ...mapMutations([
      'LOGIN_SUCCESS',
      'LOGIN_ERROR'
    ]),
    getSessionToken(oAuthCode) {
      console.log('Getting session token..')
      axios({
        url: '/auth/google/',
        method: 'POST',
        data: {code: oAuthCode}
      })
        .then(resp => {
          const token = resp.data.key
          this.LOGIN_SUCCESS(token)
          this.getSelf()
          this.$router.push('/posts')
        })
        .catch(err => {
          console.log(`Error getting session token: ${err}`)
          this.LOGIN_ERROR()
          this.$router.push('/')
        })
    },
    decodeParams() {
      let oAuthProvider = this.$route.params.provider
      let code = this.$route.query.code
      if (oAuthProvider == null || code == null) {
        this.$router.push('/')
        return
      }
      if (oAuthProvider != 'google') {
        console.log(`Unexpected oAuthProvider: ${oAuthProvider}`)
        this.$router.push('/')
        return
      }
      this.getSessionToken(code)
    }
  },
  mounted() {
    this.decodeParams();
  }
}
</script>

<style scoped>
</style>
