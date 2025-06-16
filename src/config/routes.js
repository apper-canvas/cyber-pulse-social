import HomePage from '@/components/pages/HomePage';
import ExplorePage from '@/components/pages/ExplorePage';
import NotificationsPage from '@/components/pages/NotificationsPage';
import MessagesPage from '@/components/pages/MessagesPage';
import CreatePostPage from '@/components/pages/CreatePostPage';

const routes = [
  {
    path: '/home',
    element: HomePage,
    label: 'Home',
    icon: 'Home'
  },
  {
    path: '/explore',
    element: ExplorePage,
    label: 'Explore',
    icon: 'Search'
  },
  {
    path: '/notifications',
    element: NotificationsPage,
    label: 'Notifications',
    icon: 'Bell'
  },
  {
    path: '/messages',
    element: MessagesPage,
    label: 'Messages',
    icon: 'MessageCircle'
  },
  {
    path: '/create',
    element: CreatePostPage,
    label: 'Create',
    icon: 'Plus'
  }
];

export default routes;
export { routes }; // Add named export to match App.jsx import
export const routeArray = routes;