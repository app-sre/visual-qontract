import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import { 
  Page, 
  PageSidebar, 
  PageSidebarBody, 
  PageSection, 
  Masthead, 
  MastheadMain, 
  MastheadContent,
  MastheadToggle,
  PageToggleButton
} from '@patternfly/react-core';
import { BarsIcon } from '@patternfly/react-icons';
import '@patternfly/react-core/dist/styles/base.css';
import './theme.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { apolloClient } from './lib/apollo';
import Navigation from './components/Navigation';
import ThemeSwitch from './components/ThemeSwitch';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Services from './pages/Services';
import Service from './pages/Service';
import Clusters from './pages/Clusters';
import Cluster from './pages/Cluster';
import Namespaces from './pages/Namespaces';
import Namespace from './pages/Namespace';
import Roles from './pages/Roles';
import Role from './pages/Role';
import Users from './pages/Users';
import User from './pages/User';
import Permissions from './pages/Permissions';
import Permission from './pages/Permission';
import AWSAccounts from './pages/AWSAccounts';
import AWSAccount from './pages/AWSAccount';
import AWSGroups from './pages/AWSGroups';
import AWSGroup from './pages/AWSGroup';
import Integrations from './pages/Integrations';
import Integration from './pages/Integration';
import GitHubOrgs from './pages/GitHubOrgs';
import GitHubOrg from './pages/GitHubOrg';
import QuayOrgs from './pages/QuayOrgs';
import QuayOrg from './pages/QuayOrg';
import JenkinsInstances from './pages/JenkinsInstances';
import JenkinsInstance from './pages/JenkinsInstance';
import Dependencies from './pages/Dependencies';
import Dependency from './pages/Dependency';
import Notifications from './pages/Notifications';
import Notification from './pages/Notification';
import ScoreCards from './pages/ScoreCards';
import ScoreCard from './pages/ScoreCard';
import Status from './pages/Status';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const Header = (
    <Masthead>
      <MastheadToggle>
        <PageToggleButton
          variant="plain"
          aria-label="Global navigation"
          isSidebarOpen={isSidebarOpen}
          onSidebarToggle={onSidebarToggle}
          id="nav-toggle"
        >
          <BarsIcon />
        </PageToggleButton>
      </MastheadToggle>
      <MastheadMain>
        <MastheadContent>
          <div className="app-title">
            Visual App-Interface
          </div>
        </MastheadContent>
      </MastheadMain>
      <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
        <ThemeSwitch />
      </div>
    </Masthead>
  );

  const Sidebar = (
    <PageSidebar isSidebarOpen={isSidebarOpen} id="sidebar">
      <PageSidebarBody>
        <Navigation onLinkClick={() => {
          if (isMobile) {
            setIsSidebarOpen(false);
          }
        }} />
      </PageSidebarBody>
    </PageSidebar>
  );

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider>
        <Router>
          <Page 
            masthead={Header} 
            sidebar={Sidebar}
            onPageResize={() => {}}
          >
            <PageSection id="main-content">
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/service/:servicePath" element={<Service />} />
                  <Route path="/clusters" element={<Clusters />} />
                  <Route path="/cluster/:path" element={<Cluster />} />
                  <Route path="/namespaces" element={<Namespaces />} />
                  <Route path="/namespace/:namespacePath" element={<Namespace />} />
                  <Route path="/roles" element={<Roles />} />
                  <Route path="/role/:path" element={<Role />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/user/:path" element={<User />} />
                  <Route path="/permissions" element={<Permissions />} />
                  <Route path="/permission/:path" element={<Permission />} />
                  <Route path="/aws-accounts" element={<AWSAccounts />} />
                  <Route path="/aws-account/:path" element={<AWSAccount />} />
                  <Route path="/aws-groups" element={<AWSGroups />} />
                  <Route path="/aws-group/:path" element={<AWSGroup />} />
                  <Route path="/integrations" element={<Integrations />} />
                  <Route path="/integration/:path" element={<Integration />} />
                  <Route path="/github-orgs" element={<GitHubOrgs />} />
                  <Route path="/github-org/:path" element={<GitHubOrg />} />
                  <Route path="/quay-orgs" element={<QuayOrgs />} />
                  <Route path="/quay-org/:path" element={<QuayOrg />} />
                  <Route path="/jenkins-instances" element={<JenkinsInstances />} />
                  <Route path="/jenkins-instance/:path" element={<JenkinsInstance />} />
                  <Route path="/dependencies" element={<Dependencies />} />
                  <Route path="/dependency/:path" element={<Dependency />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/notification/:path" element={<Notification />} />
                  <Route path="/scorecards" element={<ScoreCards />} />
                  <Route path="/scorecard/:path" element={<ScoreCard />} />
                  <Route path="/status" element={<Status />} />
                </Routes>
              </ErrorBoundary>
            </PageSection>
          </Page>
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
