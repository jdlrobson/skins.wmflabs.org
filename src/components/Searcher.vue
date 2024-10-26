<template>
	<div class="searcher">
		<input
			v-focus
			class="search__input"
			placeholder="Find skin"
			:value="query"
			@input="setQuery">
		<button class="searcher__filter-btn" @click="toggleFilters">
			Filters
		</button>
		<div v-if="showFilters" class="searcher__filter-list">
			<div
				v-for="( f, i ) in availableFilters"
				:key="f.name + i"
				class="searcher__filter-item">
				<CustomCheckbox
					:checked="activeFilters[f.name()]"
					name="search_release"
					@change="onToggleActiveFilter( f )"
				>
					{{ f.label() }}
				</CustomCheckbox>
			</div>
		</div>
		<p class="filter-title">
			<span v-if="fetched">Showing {{ filteredSkins.length }} / {{ skins.length }} skins.</span>
			<a
				v-if="showReset"
				class="reset"
				@click="resetAll">Show all skins</a>
	&nbsp;
		</p>
		<div v-if="hasNoResults">
			<div class="no-results-sad-face">
				😞
			</div>
			<p>No skins match that name.</p>
			<p>
				If the skin exists it may not be compatible with the latest MediaWiki version
				and be <a href="https://www.mediawiki.org/wiki/Category:Unstable_skins">marked as unstable</a>.
			</p>
			<p>You can <a :href="mwUrlEdit">add this skin to MediaWiki.org</a></p>
		</div>
	</div>
</template>

<script>
/* eslint-disable no-underscore-dangle */
import api from '../api.js';
import CustomCheckbox from './CustomCheckbox.vue';

class SessionFilter {
	constructor( name, label, defaultValue = false ) {
		this.field = `session-${ name }`;
		this._name = name;
		this._label = label || 'undefined';
		this.defaultValue = defaultValue;
		this.load( defaultValue );
	}

	name() {
		return this._name;
	}

	label() {
		return this._label;
	}

	set( value ) {
		sessionStorage.setItem( this.field, value );
		return value;
	}

	load( defaultValue ) {
		if ( sessionStorage ) {
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
const allFilters = [
	[ 'filterMightBreak', 'Without deprecation warnings' ],
	[ 'filterMaintained', 'Status:Maintained' ],
	[ 'filterDependencies', 'Without dependencies' ],
	[ 'filterCompatible', 'Compatible with latest MediaWiki' ],
	[ 'filterStable', 'Status: Stable' ],
	[ 'filterResponsive', 'Mobile friendly' ],
	[ 'filterMustache', 'Uses modern skin framework' ],
	[ 'filterInvert', 'Invert all filters' ]
].map( ( args ) => new SessionFilter( args[ 0 ], args[ 1 ] ) );

const query = new SessionFilter( 'query', 'Search query', '' );

export default {
	name: 'Searcher',
	components: {
		CustomCheckbox
	},
	props: {
		filter: {
			type: String,
			default: ''
		},
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
		let key;
		const filters = {};
		( this.filter || '' ).split( ':' ).forEach( ( str, i ) => {
			if ( i % 2 === 0 ) {
				key = str;
			} else {
				filters[ key ] = str;
			}
		} );
		const data = {
			author: filters.author,
			license: filters.license,
			showFilters: false,
			fetched: false,
			skins: [
				{}, {}, {},
				{}, {}, {},
				{}, {}, {}
			],
			filteredSkins: [],
			availableFilters: allFilters,
			activeFilters: {},
			query: filters.author ? filters.query : query.get()
		};
		allFilters.forEach( ( filter ) => {
			data.activeFilters[ filter.name() ] = filter.get();
		} );
		return data;
	},
	computed: {
		showReset() {
			const activeFilters = this.activeFilters;
			return activeFilters.filterKey || activeFilters.filterMightBreak ||
				activeFilters.filterMaintained || activeFilters.filterDependencies ||
				activeFilters.filterCompatible || activeFilters.filterStable || this.author ||
				this.query;
		},
		mwUrlEdit() {
			return `https://www.mediawiki.org/w/index.php?action=edit&preload=Template%3ASkin%2FSample&title=Skin%3A${ this.query }&venoscript=1`;
		},
		hasNoResults() {
			return this.fetched && this.filteredSkins.length === 0 && this.showNoResultsMessage;
		}
	},
	methods: {
		resetAll() {
			this.query = query.set( '' );
			this.availableFilters.forEach( ( filter ) => {
				filter.set( false );
				this.activeFilters[ filter.name() ] = false;
			} );
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
			const invert = this.activeFilters.filterInvert;
			const filterFn = ( skin ) => {
				const tags = skin.tag || [];
				if ( !q && this.author && !( skin.author || [] ).includes( this.author ) ) {
					return false;
				}
				if ( !q && this.license && ( skin[ 'license-name' ] || '' ) !== this.license ) {
					return false;
				}
				if ( this.filterKey && skin.key !== this.filterKey ) {
					return false;
				}
				if ( this.activeFilters.filterMightBreak && ( skin.mightBreak || tags.includes( 'deprecation-warnings' ) ) ) {
					return false;
				}
				if ( this.activeFilters.filterMaintained && skin.unmaintained ) {
					return false;
				}
				if ( this.activeFilters.filterStable && ( skin.experimental || skin.beta || skin.unmaintained ) ) {
					return false;
				}
				if ( this.activeFilters.filterDependencies && skin.hasDependencies ) {
					return false;
				}
				if ( this.activeFilters.filterCompatible && ( !skin.compatible || tags.includes( 'render-error' ) ) ) {
					return false;
				}
				if ( this.activeFilters.filterResponsive && !tags.includes( 'responsive' ) ) {
					return false;
				}
				if ( this.activeFilters.filterMustache && !tags.includes( 'mustache' ) ) {
					return false;
				}
				if ( !q ) {
					return true;
				}
				return skin.name && skin.name.toLowerCase().indexOf( q.toLowerCase() ) > -1;
			};
			const invertFilterFn = ( skin ) => !filterFn( skin );
			const result = this.skins.filter( invert ? invertFilterFn : filterFn );
			this.filteredSkins = result;
		},
		onToggleActiveFilter( filter ) {
			const newValue = !filter.get();
			filter.set( newValue );
			this.activeFilters[ filter.name() ] = newValue;
			this.search();
			this.activeFilters = Object.assign( {}, this.activeFilters );
		},
		setQuery( ev ) {
			this.author = null;
			this.license = null;
			this.query = ev.target.value;
			query.set( this.query );
			this.search();
			this.$emit( 'input', ev );
			this.$router.replace( `/explore/query:${ this.query }` );
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
