<template>
  <div class="page--home">
    <h2>Explore skins</h2>
    <input placeholder="Find skin" :value="query" @input="setQuery">
    <p>Showing {{ filteredSkins.length }} / {{ skins.length }} skins.</p>
    <div v-if="hasResults">
      <div style="font-size: 100px;">😞</div>
      <p>No skins match that name.</p>
      <p>You can <a :href="mwUrlEdit">add this skin to MediaWiki.org</a></p>
    </div>
    <div class="page__showcase">
        <snapshot v-for="skin in filteredSkins"
            :stable="skin.stable"
            :compatible="skin.compatible"
            :experimental="skin.experimental"
            :hasDependencies="skin.hasDependencies"
            :key="skin.key" :skinkey="skin.key" :name="skin.name" :src="skin.src"></snapshot>
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
    hasResults() {
      return this.filteredSkins.length === 0;
    },
    mwUrlEdit() {
      return `https://www.mediawiki.org/w/index.php?action=edit&preload=Template%3ASkin%2FSample&title=Skin%3A${this.query}&venoscript=1`;
    },
    filteredSkins() {
      var q = this.query;
      return !q ? this.skins : this.skins.filter((skin) => {
        return skin.name && skin.name.toLowerCase().indexOf(q.toLowerCase()) > -1;
      })
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
          page: 0,
          query: '',
          skins: [
              {}, {}, {},
              {}, {}, {},
              {}, {}, {},
              {}, {}, {},
              {}, {}/*, Add*/
          ]
        
      };
  },
  mounted: function() {
      const sortByPageViewsStableDesc = (p, p2) => {
        const prefer1 = p.compatible && !p.hasDependencies;
        const prefer2 = p2.compatible && !p2.hasDependencies;
        if(!prefer1 && prefer2) return 1;
        if(!prefer2 && prefer1) return -1;
        return p.pageviews > p2.pageviews ? -1 : 1;
      };
      this.query = localStorage.getItem('query');
      api.fetchSkins().then((skins) => {
          const sortedSkins = skins.skins.sort(sortByPageViewsStableDesc);
          this.skins = sortedSkins //.slice(this.page, 11);
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