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
<style lang="less">
@color-create-main: #B9D1CA;
@color-create-dark: #9FBBB4;
@color-white: #fff;

.tabs__links {
	list-style: none;
	margin: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0;
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
