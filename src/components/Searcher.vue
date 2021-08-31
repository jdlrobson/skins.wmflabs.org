<template>
	<div class="searcher">
		<input class="search__input"
			v-focus
			placeholder="Find skin"
			:value="query"
			@input="setQuery">
		<button class="searcher__filter-btn" @click="toggleFilters">Filters</button>
		<div v-if="showFilters" class="searcher__filter-list">
			<div class="searcher__filter-item">
			<input type="checkbox"
				:checked="filterCompatible"
				name="search_release"
				@change="onToggleCompatible"><!--
			--><label for="search_release">Compatible with latest version</label></div>
			<div class="searcher__filter-item">
			<input type="checkbox"
				:checked="filterStable"
				name="search_stable"
				@change="onToggleStable"><!--
			--><label for="search_stable">Stable</label></div>
			<div class="searcher__filter-item">
			<input type="checkbox"
				:checked="filterMightBreak"
				name="search_breakage"
				@change="onToggleMightBreak"><!--
			--><label for="search_breakage">Without deprecation warnings</label></div>
			<div class="searcher__filter-item">
			<input type="checkbox"
				:checked="filterDependencies"
				name="search_dependencies"
				@change="onToggleDependencies"><!--
			--><label for="search_dependencies">Without dependencies</label></div>
			<div class="searcher__filter-item">
			<input type="checkbox"
				:checked="filterMaintained"
				name="search_maintained"
				@change="onToggleMaintained"><!--
			--><label for="search_maintained">Maintained</label></div>
		</div>
		<p class="filter-title">
			<span v-if="fetched">Showing {{ filteredSkins.length }} / {{ skins.length }} skins.</span>
	  &nbsp;
		</p>
		<div v-if="hasNoResults">
			<div class="no-results-sad-face">
				😞
			</div>
			<p>No skins match that name.</p>
			<p>You can <a :href="mwUrlEdit">add this skin to MediaWiki.org</a></p>
		</div>
	</div>
</template>
<style lang="less" scoped>
@import '../variables.less';

.searcher {
	position: relative;
	text-align: right;

	@media ( min-width: 1440px ) {
		text-align: left;
	}
}

.search__input {
	background: white;
	padding: 10px 11px 11px 53px;
	background-repeat: no-repeat;
	background-position: 15px center;
	background-image: url(assets/search.svg);
	height: 40px;
	width: 100%;
	max-width: 602px;
	margin-bottom: 15px;
	color: @color-explore-dark;

	&::placeholder {
		color: @color-explore-dark;
	}
}

.filter-title {
	color: @color-explore-dark;
	font-size: 14px;
}

.no-results-sad-face {
	font-size: 100px;
}

a {
	color: black;
	font-weight: bold;
}

.searcher__filter-btn {
	padding: 11px 16px;
	line-height: 18.46px;
	background: @color-explore-dark;
	color: white;
	border: 0;
}

.searcher__filter-list {
	width: 280px;
	position: absolute;
	z-index: 5;
	background: @color-explore-dark;
	color: black;
	width: 100%;
	right: -12px;

	@media ( min-width: 1440px ) {
		max-width: 400px;
	}
}

.searcher__filter-item {
	padding: 12px 12px 12px 15px;

	label {
		text-transform: none;
		font-size: 14px;
	}

	input {
		margin-right: 13px;
		width: 16px;
		height: 16px;
		border-radius: 2px;
		border-color: transparent;
	}
}
</style>
<script>
import api from '../api.js';

class SessionFilter {
	constructor( name, defaultValue = false ) {
		this.field = `session-${name}`;
		this.load( defaultValue );
	}
	set( value ) {
		sessionStorage.setItem( this.field, value );
	}
	load( defaultValue ) {
		if ( typeof sessionStorage === undefined ) {
			this.value = defaultValue;
		} else {
			this.value = sessionStorage.getItem( this.field )
		}
	}
	get() {
		this.load();
		return this.value;
	}
}

// Should be persistent for page refreshes but not new tabs
const query = new SessionFilter( 'query', '' );
const filterMightBreak = new SessionFilter( 'filterMightBreak' );
const filterMaintained = new SessionFilter( 'filterMaintained' );
const filterDependencies = new SessionFilter( 'filterDependencies' );
const filterCompatible = new SessionFilter( 'filterCompatible' );
const filterStable = new SessionFilter( 'filterStable' );

export default {
	name: 'Searcher',
	props: {
		// Additional key to filter name against
		filterKey: {
			type: String
		},
		showNoResultsMessage: {
			type: Boolean,
			default: true
		}
	},
	computed: {
		mwUrlEdit() {
			return `https://www.mediawiki.org/w/index.php?action=edit&preload=Template%3ASkin%2FSample&title=Skin%3A${this.query}&venoscript=1`;
		},
		hasNoResults() {
			return this.fetched && this.filteredSkins.length === 0 && this.showNoResultsMessage;
		}
	},
	data() {
		return {
			showFilters: false,
			fetched: false,
			skins: [
				{}, {}, {},
				{}, {}, {},
				{}, {}, {}
			],
			filteredSkins: [],
			query: query.get(),
			filterMightBreak: filterMightBreak.get(),
			filterMaintained: filterMaintained.get(),
			filterDependencies: filterDependencies.get(),
			filterCompatible: filterCompatible.get(),
			filterStable: filterStable.get(),
		}
	},
	methods: {
		toggleFilters() {
			this.showFilters = !this.showFilters;
		},
		search() {
			const q = this.query;
			const result = this.skins.filter( ( skin ) => {
				if ( this.filterKey && skin.key !== this.filterKey ) return false;
				if ( this.filterMightBreak && skin.mightBreak ) { return false; }
				if ( this.filterMaintained && skin.unmaintained ) { return false; }
				if ( this.filterStable && ( skin.experimental || skin.beta || skin.unmaintained ) ) { return false; }
				if ( this.filterDependencies && skin.hasDependencies ) { return false; }
				if ( this.filterCompatible && !skin.compatible ) { return false; }
				if ( !q ) { return true; }
				return skin.name && skin.name.toLowerCase().indexOf( q.toLowerCase() ) > -1;
			} );
			this.filteredSkins = result;
		},
		onToggleDependencies( ev ) {
			const value = ev.target.checked;
			this.filterDependencies = value;
			sessionFilter.set( value );
			this.search();
		},
		onToggleMaintained( ev ) {
			const value = ev.target.checked;
			this.filterMaintained = value;
			filterMaintained.set( value );
			this.search();
		},
		onToggleMightBreak( ev ) {
			const value = ev.target.checked;
			this.filterMightBreak = value;
			filterMightBreak.set( value );
			this.search();
		},
		onToggleStable( ev ) {
			const value = ev.target.checked;
			this.filterStable = value;
			filterStable.set( value );
			this.search();
		},
		onToggleCompatible( ev ) {
			const value = ev.target.checked;
			this.filterCompatible = value;
			filterCompatible.set( value );
			this.search();
		},
		setQuery( ev ) {
			this.query = ev.target.value;
			query.set( this.query );
			this.search();
			this.$emit( 'input', ev );
		}
	},
	updated() {
		this.$emit( 'search', this.filteredSkins );
	},
	mounted() {
		const sortByPageViewsStableDesc = ( p, p2 ) => {
			if ( p.score === p2.score ) {
				return p.pageviews > p2.pageviews ? -1 : 1;
			} else {
				return p.score > p2.score ? -1 : 1;
			}
		};
		this.$emit( 'search', this.skins );
		api.fetchSkins().then( ( skins ) => {
			this.fetched = true;
			const sortedSkins = skins.skins.sort( sortByPageViewsStableDesc );
			this.skins = sortedSkins;
			this.search();
		} );
	}
}
</script>
