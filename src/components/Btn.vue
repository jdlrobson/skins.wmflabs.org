<template>
	<button :class="classList" @click="$emit( 'click' )">
		<slot></slot>
	</button>
</template>

<script>

export default {
	name: 'Btn',
	components: {},
	props: {
		destructive: {
			type: Boolean
		}
	},
	computed: {
		classList() {
			return {
				btn: true,
				'btn--destructive': this.destructive
			};
		}
	}
};
</script>

<style lang="less" scoped>
@import '../variables.less';
.btn {
	color: #fff;
	background: #000;
	text-transform: uppercase;
	padding: 11px 10px;
	min-width: 98px;
	position: relative;
	border: solid 3px transparent;
	height: 40px;
	font-weight: bold;
	text-decoration: none;
	vertical-align: top;
	text-align: center;
	line-height: 1;
	box-sizing: border-box;

	&:focus,
	&:hover {
		background: @color-create-darkest;
	}

	&:active {
		background: @color-create-darkest;
		border-color: #000;
		opacity: 0.8;
	}

	&:disabled {
		opacity: 0.5;
	}
}

.btn--destructive {
	background: @color-reset;
	color: #fff;

	&:focus,
	&:hover,
	&:active {
		background: @color-reset;
		color: transparent;
		background-repeat: no-repeat;
		background-position: center;
		background-image: url(../components/assets/reset.svg);
	}

	&:active {
		opacity: 0.8;
	}
}

</style>
