<template>
	<div v-show="isActive" class="tab">
		<slot></slot>
	</div>
</template>

<style>
.tab {
	background: white;
	width: 100%;
}
</style>

<script>
export default {
	name: 'Tab',
	components: {},
	props: {
		title: String
	},
	data() {
		return {
			isActive: true
		};
	}
};
</script>
