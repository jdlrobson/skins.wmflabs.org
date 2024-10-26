import HomePage from './pages/HomePage.vue';
import Explore from './pages/Explore.vue';
import Skin from './pages/Skin.vue';
import NotFound from './pages/NotFound.vue';
import Add from './pages/Add.vue';
import BuildExtension from './pages/BuildExtension.vue';

export default [
	{
		path: '/',
		name: 'home',
		component: HomePage
	},
	{
		path: '/build/extension',
		name: 'build-extension',
		component: BuildExtension
	},
	{
		path: '/explore/:filter?',
		name: 'explore',
		component: Explore
	},
	{
		path: '/add',
		name: 'build-skin',
		component: Add
	},
	{
		path: '/skin/:key',
		name: 'view-skin',
		component: Skin
	},
	{
		path: '/:pathMatch(.*)',
		name: 'bad-not-found',
		component: NotFound
	}
];
