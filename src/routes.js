import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import UsersPage from './pages/UsersPage';
import RolesPage from './pages/RolesPage';
import ClustersPage from './pages/ClustersPage';
import ClusterUpgradesPage from './pages/ClusterUpgradesPage';
import NamespacesPage from './pages/NamespacesPage';
import AWSAccountsPage from './pages/AWSAccountsPage';
import AWSGroupsPage from './pages/AWSGroupsPage';
import PermissionsPage from './pages/PermissionsPage';
import IntegrationsPage from './pages/IntegrationsPage';
import GitHubOrgsPage from './pages/GitHubOrgsPage';
import QuayOrgsPage from './pages/QuayOrgsPage';
import JenkinsInstancesPage from './pages/JenkinsInstancesPage';
import DependenciesPage from './pages/DependenciesPage';
import DocumentsPage from './pages/DocumentsPage';
import ReportsPage from './pages/ReportsPage';
import NotificationsPage from './pages/NotificationsPage';

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
    iconClass: 'fa fa-upload',
    title: 'Cluster Upgrades',
    to: '/clusterUpgrades',
    component: ClusterUpgradesPage
  },
  {
    iconClass: 'fa fa-desktop',
    title: 'Namespaces',
    to: '/namespaces',
    component: NamespacesPage
  },
  {
    iconClass: 'fa  fa-file-text-o',
    title: 'Documents',
    to: '/documents',
    component: DocumentsPage
  },
  {
    iconClass: 'fa  fa-file-text-o',
    title: 'Reports',
    to: '/reports',
    component: ReportsPage
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
    title: 'AWS Accounts',
    to: '/awsaccounts',
    component: AWSAccountsPage
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
    iconClass: 'fa  fa-github',
    title: 'GitHub orgs',
    to: '/githuborgs',
    component: GitHubOrgsPage
  },
  {
    iconClass: 'fa fa-cloud-upload',
    title: 'Quay orgs',
    to: '/quayorgs',
    component: QuayOrgsPage
  },
  {
    iconClass: 'fa  fa-cogs',
    title: 'Jenkins instances',
    to: '/jenkinsinstances',
    component: JenkinsInstancesPage
  },
  {
    iconClass: 'fa  fa-random',
    title: 'Dependencies',
    to: '/dependencies',
    component: DependenciesPage
  },
  {
    iconClass: 'fa  fa-bell',
    title: 'Notifications',
    to: '/notifications',
    component: NotificationsPage
  },
];

export { baseName, routes };
