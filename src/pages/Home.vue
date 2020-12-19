<template>
  <div class="page--home">
    <h2>Explore skins</h2>
    <input placeholder="Find skin" :value="query" @input="setQuery">
    <div class="page__showcase">
        <snapshot v-for="skin in filteredSkins"
            :key="skin.key" :skinkey="skin.key" :name="skin.name" :src="skin.src"></snapshot>
        <snapshot key="add-skin" 
          url="/add"
          name="Add a skin" src="https://upload.wikimedia.org/wikipedia/commons/c/ca/Supernova_%28CGI%29.jpg"></snapshot>
    </div>
  </div>
</template>

<script>
import api from '../api.js';
import Snapshot from '../components/Snapshot.vue';

export default {
  name: 'Home',
  components: {
      Snapshot
  },
  computed: {
    filteredSkins() {
      var q = this.query;
      return !q ? this.skins : this.skins.filter((skin) => {
        return skin.name && skin.name.toLowerCase().indexOf(q.toLowerCase()) > -1;
      });
    }
  },
  methods: {
    setQuery(ev) {
      this.query = ev.target.value;
      localStorage.setItem('query', this.query);
    }
  },
  data() {
      return {
          query: '',
          skins: [
              {}, {}, {},
              {}, {}, {}
          ]
        
      };
  },
  mounted: function() {
      this.query = localStorage.getItem('query');
      api.fetchSkins().then((skins) => {
          this.skins = skins.skins;
      });
  }
};
</script>

<style scoped>
  .page__showcase {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    flex-flow: row wrap;
  }

  input {
    height: 30px;
    width: 500px;
    margin-bottom: 10px;
  }
</style>