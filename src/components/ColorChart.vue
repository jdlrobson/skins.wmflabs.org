<template>
	<div class="color-chart">
		<span v-for="(c, i) in colors"
			:key="'color' + i"
			class="color-chart__blot"
			:style="'background: ' + c.color + ';'"
			:title="c.key + ' : ' + c.color"
			@click="$emit('toggleColor', c.key)">
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
	width: 20px;
	height: 20px;
}
</style>
