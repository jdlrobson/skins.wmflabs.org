<template>
	<div v-show="isActive" class="tab">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: 'Tab',
	components: {},
	props: {
		title: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			isActive: true
		};
	}
};
</script>

<style>
.tab {
	background: white;
	width: 100%;
}
</style>
