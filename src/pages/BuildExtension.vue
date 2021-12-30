<template>
	<page class="page--new">
		<h1>Extension builder</h1>
		<p>Let's build an extension!</p>
		<form>
			<input v-model="name" placeholder="Extension name">
			<btn
				:disabled="!name"
				@click="newExtension">
				Build
			</btn>
		</form>
	</page>
</template>

<script>
import Page from './Page.vue';
import Btn from '../components/Btn';
import { buildExtension } from '../starter-template';

export default {
	name: 'BuildExtensions',
	components: {
		Page,
		Btn
	},
	data() {
		return {
			name: ''
		};
	},
	methods: {
		newExtension() {
			buildExtension(
				this.name,
				{}
			);
		}
	}
};

</script>
