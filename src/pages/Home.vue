<template>
	<div class="page--home">
		<h2>Explore skins</h2>
		<input class="search__input"
			placeholder="Find skin"
			:value="query"
			@input="setQuery">
		<div>
			must be
			<input type="checkbox"
				:checked="filterCompatible"
				name="search_release"
				@change="onToggleCompatible">
			<label for="search_release">compatible with >= 1.37</label>
			<input type="checkbox"
				:checked="filterStable"
				name="search_stable"
				@change="onToggleStable">
			<label for="search_stable">is stable</label>
			<input type="checkbox"
				:checked="filterMightBreak"
				name="search_breakage"
				@change="onToggleMightBreak">
			<label for="search_breakage">without deprecation warnings</label>
			<input type="checkbox"
				:checked="filterDependencies"
				name="search_dependencies"
				@change="onToggleDependencies">
			<label for="search_dependencies">have no dependencies</label>
			<input type="checkbox"
				:checked="filterMaintained"
				name="search_maintained"
				@change="onToggleMaintained">
			<label for="search_maintained">are maintained</label>
		</div>
		<p>
			<span v-if="fetched">Showing {{ filteredSkins.length }} / {{ skins.length }} skins.</span>
      &nbsp;
		</p>
		<div v-if="hasResults">
			<div class="no-results-sad-face">
				😞
			</div>
			<p>No skins match that name.</p>
			<p>You can <a :href="mwUrlEdit">add this skin to MediaWiki.org</a></p>
		</div>
		<div class="page__showcase">
			<snapshot v-for="skin in filteredSkins"
				:key="skin.key"
				:stable="skin.stable"
				:compatible="skin.compatible"
				:unmaintained="skin.unmaintained"
				:beta="skin.beta"
				:might-break="skin.mightBreak"
				:experimental="skin.experimental"
				:has-dependencies="skin.hasDependencies"
				:skinkey="skin.key"
				:name="skin.name"
				:src="skin.src"></snapshot>
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
	data() {
		return {
			filterMightBreak: !!localStorage.getItem( 'filterMightBreak' ),
			filterMaintained: !!localStorage.getItem( 'filterMaintained' ),
			filterDependencies: !!localStorage.getItem( 'filterDependencies' ),
			filterCompatible: !!localStorage.getItem( 'filterCompatible' ),
			filterStable: !!localStorage.getItem( 'filterStable' ),
			fetched: false,
			page: 0,
			query: localStorage.getItem( 'query' ) || '',
			skins: [
				{}, {}, {},
				{}, {}, {},
				{}, {}, {},
				{}, {}, {},
				{}, {}/* , Add */
			]

		};
	},
	computed: {
		hasResults() {
			return this.filteredSkins.length === 0;
		},
		mwUrlEdit() {
			return `https://www.mediawiki.org/w/index.php?action=edit&preload=Template%3ASkin%2FSample&title=Skin%3A${this.query}&venoscript=1`;
		},
		filteredSkins() {
			const q = this.query;
			return this.skins.filter( ( skin ) => {
				if ( this.filterMightBreak && skin.mightBreak ) { return false; }
				if ( this.filterMaintained && skin.unmaintained ) { return false; }
				if ( this.filterStable && ( skin.experimental || skin.beta || skin.unmaintained ) ) { return false; }
				if ( this.filterDependencies && skin.hasDependencies ) { return false; }
				if ( this.filterCompatible && !skin.compatible ) { return false; }
				if ( !q ) { return true; }
				return skin.name && skin.name.toLowerCase().indexOf( q.toLowerCase() ) > -1;
			} );
		}
	},
	methods: {
		onToggleLocalStorageField( key, value ) {
			this[ key ] = value;
			if ( value ) {
				localStorage.setItem( key, 1 );
			} else {
				localStorage.removeItem( key, 1 );
			}
		},
		onToggleDependencies( ev ) {
			this.onToggleLocalStorageField( 'filterDependencies', ev.target.checked );
		},
		onToggleMaintained( ev ) {
			this.onToggleLocalStorageField( 'filterMaintained', ev.target.checked );
		},
		onToggleMightBreak( ev ) {
			this.onToggleLocalStorageField( 'filterMightBreak', ev.target.checked );
		},
		onToggleStable( ev ) {
			this.onToggleLocalStorageField( 'filterStable', ev.target.checked );
		},
		onToggleCompatible( ev ) {
			this.onToggleLocalStorageField( 'filterCompatible', ev.target.checked );
		},
		setQuery( ev ) {
			this.query = ev.target.value;
			localStorage.setItem( 'query', this.query );
		}
	},
	mounted: function () {
		const sortByPageViewsStableDesc = ( p, p2 ) => {
			if ( p.score === p2.score ) {
				return p.pageviews > p2.pageviews ? -1 : 1;
			} else {
				return p.score > p2.score ? -1 : 1;
			}
		};
		api.fetchSkins().then( ( skins ) => {
			this.fetched = true;
			const sortedSkins = skins.skins.sort( sortByPageViewsStableDesc );
			this.skins = sortedSkins; // .slice(this.page, 11);
		} );
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

  .search__input {
    height: 30px;
    width: 500px;
    margin-bottom: 10px;
  }

  .no-results-sad-face {
    font-size: 100px;
  }
</style>
