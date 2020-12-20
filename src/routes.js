import Home from './pages/Home';
import Skin from './pages/Skin';
import NotFound from './pages/NotFound';
import Add from './pages/Add';

export default [
  {
     path: '/',
      component: Home
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