<template>
  <div class="page--home">
    <h2>New skin</h2>
    <p>Coming soon. Until then... <router-link to="/">
      Explore other skins
    </router-link></p>
    <div>
      <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/Supernova_%28CGI%29.jpg" alt="a supernova"/>
    </div>
    
  </div>
</template>

<script>
import api from '../api.js';
import { CATEGORY_SKINS } from '../constants';
import Snapshot from '../components/Snapshot.vue';

export default {
  name: 'Add',
  data: () => ( {
    category: CATEGORY_SKINS
  } ),
  components: {}
}
</script>
