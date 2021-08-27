<template>
	<div class="tabs">
		<ul class="tabs__links">
			<li class="tabs__link" v-for="(tab, i) in tabs" :key="tab.title"
				@click="selectTab(i)"
				:class="{'tabs__link--selected': i === selectedIndex }">
				{{ tab.title }}
			</li>
		</ul>
		<slot />
	</div>
</template>
<style>
	.tabs__links {
		list-style: none;
		margin: 0;
		font-size: 20px;
	}
	.tabs__link {
		cursor: pointer;
		display: inline-block;
		margin: 0 4px;
	}
	.tabs__link--selected {
		border-bottom: solid 2px #aaa;
	}
</style>
<script>
export default {
	name: 'Tabs',
	components: {},
	created () {
		this.tabs = this.$children;
	},
	methods: {
		selectTab ( selectedIndex ) {
			this.selectedIndex = selectedIndex;
			this.tabs.forEach( ( tab, i ) => {
				tab.isActive = ( selectedIndex === i );
			} );
		}
	},
	mounted () {
		this.selectTab( 0 )
	},
	data() {
		return {
			selectedIndex: 0,
			tabs: []
		}
	},
};
</script>
