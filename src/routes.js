import Home from './pages/Home';
import Ipsum1A from './pages/Ipsum-1-A';
import Ipsum1B from './pages/Ipsum-1-B';
import Dolor from './pages/Dolor';
import Amet from './pages/Amet';
import Orbis from './pages/Orbis';
import UsersPage from './pages/UsersPage';

const baseName = '/';

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
    iconClass: 'fa fa-star',
    title: 'Dolor',
    to: '/dolor',
    component: Dolor
  },
  {
    iconClass: 'fa fa-bell',
    title: 'Amet',
    to: '/amet',
    component: Amet
  },
  {
    iconClass: 'fa fa-shield',
    title: 'Orbis',
    to: '/orbis',
    component: Orbis
  }
];

export { baseName, routes };
