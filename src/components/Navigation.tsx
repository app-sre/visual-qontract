import React from 'react';
import { Nav, NavItem, NavList } from '@patternfly/react-core';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavigationProps {
  onLinkClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onLinkClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/clusters', label: 'Clusters' },
    { path: '/namespaces', label: 'Namespaces' },
    { path: '/roles', label: 'Roles' },
    { path: '/users', label: 'Users' },
    { path: '/permissions', label: 'Permissions' },
    { path: '/aws-accounts', label: 'AWS Accounts' },
    { path: '/aws-groups', label: 'AWS Groups' },
    { path: '/integrations', label: 'Integrations' },
    { path: '/github-orgs', label: 'GitHub Organizations' },
    { path: '/quay-orgs', label: 'Quay Organizations' },
    { path: '/jenkins-instances', label: 'Jenkins Instances' },
    { path: '/dependencies', label: 'Dependencies' },
    { path: '/notifications', label: 'Notifications' },
    { path: '/scorecards', label: 'Score Cards' },
    { path: '/status', label: 'Status' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <Nav>
      <NavList>
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            isActive={location.pathname === item.path}
            onClick={() => handleNavClick(item.path)}
          >
            {item.label}
          </NavItem>
        ))}
      </NavList>
    </Nav>
  );
};

export default Navigation;