import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import UsersPage from './pages/UsersPage';
import RolesPage from './pages/RolesPage';
import ClustersPage from './pages/ClustersPage';
import NamespacesPage from './pages/NamespacesPage';
import AWSGroupsPage from './pages/AWSGroupsPage';
import PermissionsPage from './pages/PermissionsPage';
import IntegrationsPage from './pages/IntegrationsPage';
import JenkinsInstancesPage from './pages/JenkinsInstancesPage';

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
    iconClass: 'fa fa-server',
    title: 'Clusters',
    to: '/clusters',
    component: ClustersPage
  },
  {
    iconClass: 'fa fa-desktop',
    title: 'Namespaces',
    to: '/namespaces',
    component: NamespacesPage
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
  },
  {
    iconClass: 'fa fa-key',
    title: 'Permissions',
    to: '/permissions',
    component: PermissionsPage
  },
  {
    iconClass: 'fa fa-amazon',
    title: 'AWS Groups',
    to: '/awsgroups',
    component: AWSGroupsPage
  },
  {
    iconClass: 'fa  fa-refresh',
    title: 'Integrations',
    to: '/integrations',
    component: IntegrationsPage
  },
  {
    iconClass: 'fa  fa-refresh',
    title: 'Jenkins instances',
    to: '/jenkinsinstances',
    component: JenkinsInstancesPage
  }
];

export { baseName, routes };
