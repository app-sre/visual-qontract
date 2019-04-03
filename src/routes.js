import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import UsersPage from './pages/UsersPage';
import RolesPage from './pages/RolesPage';

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
    iconClass: 'fa fa-th-list',
    title: 'Services',
    to: '/services',
    component: ServicesPage
  },
  {
    iconClass: 'fa fa-user',
    title: 'Users',
    to: '/users',
    component: UsersPage
  },
  {
    iconClass: 'fa fa-users',
    title: 'Roles',
    to: '/roles',
    component: RolesPage
  }
];

export { baseName, routes };
