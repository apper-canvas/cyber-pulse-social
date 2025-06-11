import Home from '../pages/Home';
import Explore from '../pages/Explore';
import Create from '../pages/Create';
import Notifications from '../pages/Notifications';
import Profile from '../pages/Profile';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
    component: Home
  },
  explore: {
    id: 'explore',
    label: 'Explore',
    path: '/explore',
    icon: 'Compass',
    component: Explore
  },
  create: {
    id: 'create',
    label: 'Create',
    path: '/create',
    icon: 'PlusCircle',
    component: Create
  },
  notifications: {
    id: 'notifications',
    label: 'Notifications',
    path: '/notifications',
    icon: 'Bell',
    component: Notifications
  },
  profile: {
    id: 'profile',
    label: 'Profile',
    path: '/profile',
    icon: 'User',
    component: Profile
  }
};

export const routeArray = Object.values(routes);