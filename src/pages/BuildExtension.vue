<template>
	<page class="page--new">
		<h1>Extension builder</h1>
		<p>Let's build an extension!</p>
		<form>
			<input v-model="name" placeholder="Extension name">
			<h2>Hooks</h2>
			<p>
				<input v-model="hookSkinAfterPortlet"
					type="checkbox"
					name="hookSkinAfterPortlet">
				<label>SkinAfterPortlet: Add HTML after a portlet.</label>
			</p>
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
import { getCachedProperties, setCachedProperty } from './cachedProperties';

const LS_NAMESPACE = 'ext-builder';
const DEFAULTS = {
	hookSkinAfterPortlet: false,
	name: ''
};

export default {
	name: 'BuildExtensions',
	components: {
		Page,
		Btn
	},
	data() {
		return getCachedProperties( 'ext-builder', DEFAULTS );
	},
	methods: {
		newExtension() {
			buildExtension(
				this.name,
				{
					hooks: {
						SkinAfterPortlet: this.hookSkinAfterPortlet
					}
				}
			);
		}
	},
	updated() {
		Object.keys( DEFAULTS ).forEach( ( key ) => {
			setCachedProperty( LS_NAMESPACE, key, this[ key ] );
		} );
	}
};

</script>
