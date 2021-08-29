import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import routes from './routes';

Vue.use( VueRouter );

const router = new VueRouter( {
	routes
} );

Vue.directive( 'focus', {
	// When the bound element is inserted into the DOM...
	inserted: function (el) {
		// Focus the element
		el.focus()
	}
} );

new Vue( {
	el: '#app',
	router,
	render: ( h ) => h( App )
} );
