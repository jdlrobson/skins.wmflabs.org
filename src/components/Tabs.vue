<template>
	<div class="tabs">
		<ul class="tabs__links">
			<li v-for="(tab, i) in tabs"
				:key="tab.title"
				class="tabs__link"
				:class="{ 'tabs__link--selected': i === selectedIndex }"
				@click="selectTab(i)">
				{{ tab.title }}
			</li>
		</ul>
		<slot></slot>
	</div>
</template>

<style lang="less">
@import '../variables.less';
.tabs__links {
	list-style: none;
	margin: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0;
	text-align: center;
}
.tabs__link {
	cursor: pointer;
	border-radius: 10px 10px 0 0;
	width: 235px;
	height: 40px;
	margin-right: 8px;
	align-self: flex-end;
	color: @color-white;
	background: @color-create-main;
	padding-top: 11px;
	padding-bottom: 11px;

	&:last-child {
		margin-right: 0;
	}
}
.tabs__link--selected {
	background: @color-white;
	color: @color-create-dark;
}
</style>

<script>
export default {
	name: 'Tabs',
	components: {},
	data() {
		return {
			selectedIndex: 0,
			tabs: []
		};
	},
	methods: {
		selectTab( selectedIndex ) {
			this.selectedIndex = selectedIndex;
			this.tabs.forEach( ( tab, i ) => {
				tab.isActive = ( selectedIndex === i );
			} );
		}
	},
	created() {
		this.tabs = this.$children;
	},
	mounted() {
		this.selectTab( 0 );
	}
};
</script>
