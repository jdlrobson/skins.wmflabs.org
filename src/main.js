import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import routes from './routes';

const router = createRouter( {
	history: createWebHashHistory(),
	routes
} );

const app = createApp( App )
	.use( router )
	.directive( 'focus', {
		// When the bound element is inserted into the DOM...
		inserted: function ( el ) {
			// Focus the element
			el.focus();
		}
	} )
	.mount( '#app' );
