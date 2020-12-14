
import axios from 'axios';

async function get_oauth_authorize_url() {
  // axios.get('../api/auth/google/url/')
  // axios.get('localhost:8000/auth/google/url/')
  // .then((response) => {
  //   console.log(response.data);
  //   // this.fields = response.data;
  //   // this.top10 = response.data;
  // })
  // .catch(function(error) {
  //   console.log(error);
  // })
  // .then(function() {
  //   // always executed
  // });
  let res = await axios.get('http://127.0.0.1:8000/auth/google/url/', {
    headers: {
      // "Access-Control-Allow-Origin": "*"
    }
  });
  console.log(res.data);
}

export default {
  login: function(oAuthProvider) {
    if (oAuthProvider == 'google') {
      console.log("Logging in via Google..");
      var authorize_url = get_oauth_authorize_url();
      console.log(authorize_url);
    } else {
      console.log('Unexpected oAuthProvider: ' + oAuthProvider);
    }
  }
}
