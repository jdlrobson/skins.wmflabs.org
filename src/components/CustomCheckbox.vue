<template>
	<div class="custom-checkbox">
		<input type="checkbox"
			:name="name"
			:checked="checked"
			@change="changeEvent.stopPropagation"
			@input="inputEvent"><!--
		--><label :for="name">
			<slot></slot>
		</label>
	</div>
</template>

<script>
export default {
	name: 'CustomCheckbox',
	props: {
		name: {
			type: String,
			required: true
		},
		checked: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		changeEvent( ev ) {
			this.$emit( 'change', ev );
		},
		inputEvent( ev ) {
			this.$emit( 'input', ev );
		}
	}
};
</script>

<style lang="less">
.custom-checkbox {
	position: relative;

	input[type="checkbox"] {
		width: 100%;
		position: absolute;
		left: 0;
		right: 0;
		height: 100%;
		opacity: 0;
	}

	@label-left: 13px;
	@checkbox-size: 16px;

	label {
		padding-left: @label-left + @checkbox-size;
		background-image: url(./assets/unchecked.svg);
		height: 16px;
		height: 100%;
		display: inline-block;
		background-repeat: no-repeat;
		background-position: left center;
		background-size: @checkbox-size @checkbox-size;
	}

	:checked + label {
		background-image: url(./assets/checked.svg);
	}
}
</style>
