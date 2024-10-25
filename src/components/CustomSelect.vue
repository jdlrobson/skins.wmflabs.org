<template>
	<div class="custom-select">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: 'CustomSelect'
};
</script>

<style>
.custom-select {
	position: relative;
	display: inline;
}

.custom-select select {
	appearance: none;
	height: 40px;
	min-width: 130px;
	padding: 0 18px;
	border: solid 3px black;
	background: white;
}

.custom-select:after {
	content: '';
	display: block;
	position: absolute;
	width: 40px;
	height: 40px;
	background-repeat: no-repeat;
	right: auto;
	top: 3px;
	right: -3px;
	top: 6px;
	background-image: url(assets/arrow.svg)
}
</style>
