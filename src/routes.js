import HomePage from './pages/HomePage.vue';
import Explore from './pages/Explore.vue';
import Skin from './pages/Skin.vue';
import NotFound from './pages/NotFound.vue';
import Add from './pages/Add.vue';
import BuildExtension from './pages/BuildExtension.vue';

export default [
	{
		path: '/',
		component: HomePage
	},
	{
		path: '/build/extension',
		component: BuildExtension
	},
	{
		path: '/explore/:filter?',
		component: Explore
	},
	{
		path: '/add',
		component: Add
	},
	{
		path: '/skin/:key',
		component: Skin
	},
	{
		path: '/:catchAll(.*)',
		component: NotFound
	}
];
