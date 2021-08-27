<template>
	<div class="tab" v-show="isActive">
		<slot/>
	</div>
</template>
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
