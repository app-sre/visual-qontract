import Home from './pages/Home';
import UsersPage from './pages/UsersPage';
import ServicesPage from './pages/ServicesPage';

const baseName = '/';

// https://fontawesome.com/v4.7.0/icons/

const routes = () => [
  {
    iconClass: 'fa fa-dashboard',
    title: 'Home',
    to: '/',
    component: Home
  },
  {
    iconClass: 'fa fa-user',
    title: 'Users',
    to: '/users',
    component: UsersPage
  },
  {
    iconClass: 'fa fa-th-list',
    title: 'Services',
    to: '/services',
    component: ServicesPage
  }
];

export { baseName, routes };
