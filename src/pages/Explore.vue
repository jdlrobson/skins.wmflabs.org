<template>
	<page class="page--explore">
		<h2>Explore skins</h2>
		<searcher class="page__header" @search="onSearch"></searcher>
		<div class="page__showcase">
			<snapshot v-for="skin in skins"
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
	</page>
</template>

<script>
import Page from './Page.vue';
import Searcher from '../components/Searcher.vue';
import Snapshot from '../components/Snapshot.vue';

export default {
	name: 'Explore',
	components: {
		Page,
		Searcher,
		Snapshot
	},
	data() {
		return {
			page: 0,
			skins: [
				{}, {}, {},
				{}, {}, {},
				{}, {}, {},
				{}, {}, {},
				{}, {}/* , Add */
			]

		};
	},
	methods: {
		onSearch( skins ) {
			this.skins = skins;
		}
	}
};
</script>

<style lang="less" scoped>
@import '../variables.less';
.page__showcase {
	display: flex;
	justify-content: space-between;
	flex-direction: row;
	flex-flow: row wrap;
}

a {
	color: black;
}
</style>
