<template>
	<div class="searcher">
		<input v-focus
			class="search__input"
			placeholder="Find skin"
			:value="query"
			@input="setQuery">
		<button class="searcher__filter-btn" @click="toggleFilters">
			Filters
		</button>
		<div v-if="showFilters" class="searcher__filter-list">
			<div class="searcher__filter-item">
				<custom-checkbox
					:checked="filterCompatible"
					name="search_release"
					@change="onToggleCompatible"
				>
					Compatible >= 1.37
				</custom-checkbox>
			</div>
			<div class="searcher__filter-item">
				<custom-checkbox
					:checked="filterStable"
					name="search_stable"
					@change="onToggleStable"
				>
					Stable
				</custom-checkbox>
			</div>
			<div class="searcher__filter-item">
				<custom-checkbox
					:checked="filterMightBreak"
					name="search_breakage"
					@change="onToggleMightBreak"
				>
					Without deprecation warnings
				</custom-checkbox>
			</div>
			<div class="searcher__filter-item">
				<custom-checkbox
					:checked="filterDependencies"
					name="search_dependencies"
					@change="onToggleDependencies"
				>
					Without dependencies
				</custom-checkbox>
			</div>
			<div class="searcher__filter-item">
				<custom-checkbox
					:checked="filterMaintained"
					name="search_maintained"
					@change="onToggleMaintained"
				>
					Maintained
				</custom-checkbox>
			</div>
		</div>
		<p class="filter-title">
			<span v-if="fetched">Showing {{ filteredSkins.length }} / {{ skins.length }} skins.</span>
			<a v-if="showReset"
				class="reset"
				@click="resetAll">Show all skins</a>
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

<script>
import api from '../api.js';
import CustomCheckbox from './CustomCheckbox.vue';

class SessionFilter {
	constructor( name, defaultValue = false ) {
		this.field = `session-${name}`;
		this.defaultValue = defaultValue;
		this.load( defaultValue );
	}
	set( value ) {
		sessionStorage.setItem( this.field, value );
		return value;
	}
	load( defaultValue ) {
		if ( typeof sessionStorage === undefined ) {
			this.value = defaultValue;
		} else {
			this.value = sessionStorage.getItem( this.field ) || this.defaultValue;
		}
	}
	get() {
		this.load( this.defaultValue );
		// cast to boolean
		if ( this.value === 'true' ) {
			this.value = true;
		}
		if ( this.value === 'false' ) {
			this.value = false;
		}
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
	components: {
		CustomCheckbox
	},
	props: {
		// Additional key to filter name against
		filterKey: {
			type: String,
			default: ''
		},
		showNoResultsMessage: {
			type: Boolean,
			default: true
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
			filterStable: filterStable.get()
		};
	},
	computed: {
		showReset() {
			return this.filterKey || this.filterMightBreak ||
				this.filterMaintained || this.filterDependencies ||
				this.filterCompatible || this.filterStable ||
				this.query;
		},
		mwUrlEdit() {
			return `https://www.mediawiki.org/w/index.php?action=edit&preload=Template%3ASkin%2FSample&title=Skin%3A${this.query}&venoscript=1`;
		},
		hasNoResults() {
			return this.fetched && this.filteredSkins.length === 0 && this.showNoResultsMessage;
		}
	},
	methods: {
		resetAll() {
			this.query = query.set( '' );
			this.filterMightBreak = filterMightBreak.set( false );
			this.filterMaintained = filterMaintained.set( false );
			this.filterDependencies = filterDependencies.set( false );
			this.filterCompatible = filterCompatible.set( false );
			this.filterStable = filterStable.set( false );
			this.filteredSkins = this.skins;
			this.$router.push( {
				path: '/explore'
			} );
		},
		toggleFilters() {
			this.showFilters = !this.showFilters;
		},
		search() {
			const q = this.query;
			const result = this.skins.filter( ( skin ) => {
				if ( this.filterKey && skin.key !== this.filterKey ) { return false; }
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
			filterDependencies.set( value );
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
};
</script>

<style lang="less" scoped>
@import '../variables.less';

.searcher {
	position: relative;
	text-align: center;
}

.search__input {
	font-family: 'Roboto Regular';
	box-sizing: border-box;
	background: #fff;
	padding: 10px 11px 11px 53px;
	background-repeat: no-repeat;
	background-position: 15px center;
	background-image: url( assets/search.svg );
	height: 40px;
	width: 100%;
	max-width: 400px;
	margin-bottom: 15px;
	color: @color-explore-dark;

	&::placeholder {
		color: @color-explore-dark;
	}
}

.filter-title {
	color: @color-explore-dark;
	font-size: 14px;
	margin: 15px 0 27px 0;
}

.no-results-sad-face {
	font-size: 100px;
}

a {
	color: #000;
	font-weight: bold;
}

.searcher__filter-btn {
	padding: 0;
	box-sizing: border-box;
	line-height: 18.46px;
	background: #000;
	color: #fff;
	border: 0;
	background-image: url(./assets/filter.svg);
	background-repeat: no-repeat;
	width: 40px;
	height: 40px;
	background-position: center;
	color: transparent;
	border: solid 4px transparent;

	&:focus {
		border-color: orange;
	}
}

.searcher__filter-list {
	display: block;
	z-index: 5;
	background: @color-explore-dark;
	color: #000;
	margin: auto;
	text-align: left;

	@media ( min-width: 1400px ) {
		max-width: 450px;
	}
}

.reset {
	text-transform: uppercase;
	cursor: pointer;

	&:hover {
		text-decoration: underline;
	}
}

.searcher__filter-item {
	padding: 12px 12px 12px 19px;

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
