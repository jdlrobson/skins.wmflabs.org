<template>
	<div class="tab" v-show="isActive">
		<slot/>
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
	props: {
		title: String
	},
	components: {},
	data() {
		return {
			isActive: true
		}
	},
};
</script>
