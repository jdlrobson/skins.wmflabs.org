import HomePage from './pages/HomePage';
import Explore from './pages/Explore';
import Skin from './pages/Skin';
import NotFound from './pages/NotFound';
import Add from './pages/Add';
import BuildExtension from './pages/BuildExtension';

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
		path: '*',
		component: NotFound
	}
];
