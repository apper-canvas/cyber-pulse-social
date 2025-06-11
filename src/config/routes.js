import HomePage from '@/components/pages/HomePage';
import ExplorePage from '@/components/pages/ExplorePage';
import CreatePostPage from '@/components/pages/CreatePostPage';
import NotificationsPage from '@/components/pages/NotificationsPage';
import ProfilePage from '@/components/pages/ProfilePage';

export const routes = {
  home: {
    id: 'home',
label: 'Home',
    path: '/home',
    icon: 'Home',
    component: HomePage
  },
  explore: {
    id: 'explore',
label: 'Explore',
    path: '/explore',
    icon: 'Compass',
    component: ExplorePage
  },
  create: {
    id: 'create',
label: 'Create',
    path: '/create',
    icon: 'PlusCircle',
    component: CreatePostPage
  },
  notifications: {
    id: 'notifications',
label: 'Notifications',
    path: '/notifications',
    icon: 'Bell',
    component: NotificationsPage
  },
  profile: {
    id: 'profile',
label: 'Profile',
    path: '/profile',
    icon: 'User',
    component: ProfilePage
  }
};

export const routeArray = Object.values(routes);