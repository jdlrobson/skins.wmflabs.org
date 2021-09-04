import Explore from './pages/Explore';
import Skin from './pages/Skin';
import NotFound from './pages/NotFound';
import Add from './pages/Add';

export default [
	{
		path: '/',
		component: Explore
	},
	{
		path: '/explore',
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
