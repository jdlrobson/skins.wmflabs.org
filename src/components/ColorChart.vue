<template>
	<div class="color-chart">
		<span v-for="(c, i) in colors"
			:key="'color' + i"
			class="color-chart__blot"
			:style="'background: ' + c.color + ';'"
			:title="c.key + ' : ' + c.color">
			&nbsp;
		</span>
	</div>
</template>

<script>
export default {
	name: 'ColorChart',
	components: {},
	props: {
		colors: {
			type: Array,
			required: true
		}
	}
};
</script>

<style lang="less">
.color-chart {
	display: flex;
	justify-content: center;
}
.color-chart__blot {
	width: 50px;
	height: 50px;
}
</style>
