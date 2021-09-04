<template>
	<page class="page--explore">
		<searcher class="page__header" @search="onSearch"></searcher>
		<div class="page__showcase">
			<snapshot v-for="skin in skins"
				:key="skin.key"
				:highlight="skins.length === 1"
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
.page--explore {
	background: @color-explore-light;
}

.page__showcase {
	display: flex;
	justify-content: space-between;
	flex-direction: row;
	flex-flow: row wrap;
	row-gap: 30px;
	align-items: start;
	align-content: start;
	overflow: scroll;
	padding-bottom: 90px; // this should be the height of .page__header
	max-height: 100%;
}

a {
	color: black;
}
</style>
