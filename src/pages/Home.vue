<template>
  <div>
    <h2>Recently added skins</h2>
    <div v-if="skins"></div>
    <div v-else>
        test
    </div>
  </div>
</template>

<script>
import api from '../api.js';
//import SkinSnapshot from '../components/SkinSnapshot';

export default {
  name: 'Home',
  components: {
      
  },
  data() {
      return {
          skins: false
        
      };
  },
  mounted: function() {
      api.fetchSkins().then((skins) => {
          this.skins
      });
      console.log('go');
  }
};
</script>

<style scoped>
  h1 {
    text-transform: uppercase;
  }
  .container {
    width: 600px;
    margin: 50px auto;
    text-align: center;
  }
</style>