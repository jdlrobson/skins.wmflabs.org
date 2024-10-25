import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import routes from './routes';

const router = createRouter( {
	history: createWebHashHistory(),
	routes
} );

const app = createApp( App );

app.use( router );

app.directive( 'focus', {
	// When the bound element is inserted into the DOM...
	inserted: function ( el ) {
		// Focus the element
		el.focus();
	}
} );
const fragment = document.createDocumentFragment();
app.mount( fragment );
const appNode = document.querySelector( '#app');
appNode.parentNode.replaceChild( fragment, appNode );
