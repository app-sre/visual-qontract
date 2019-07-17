import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import { IntrospectionFragmentMatcher, InMemoryCache } from 'apollo-cache-inmemory';
import { VerticalNav, VerticalNavItem, VerticalNavSecondaryItem, VerticalNavMasthead } from 'patternfly-react';
import { routes } from './routes';
import './App.css';
import introspectionQueryResultData from './fragmentTypes.json';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
});

const cache = new InMemoryCache({ fragmentMatcher });

const client = new ApolloClient({
  cache,
  uri: window.GRAPHQL_URI || '/graphql'
});

class App extends React.Component {
  constructor() {
    super();

    this.menu = routes();
  }

  handleNavClick = event => {
    event.preventDefault();
    const target = event.currentTarget;
    const { history } = this.props;
    if (target.getAttribute) {
      const href = target.getAttribute('href');
      history.push(href);
    }
  };

  renderContent = () => {
    const allRoutes = [];
    this.menu.map((item, index) => {
      allRoutes.push(<Route key={index} exact path={item.to} component={item.component} />);
      return allRoutes;
    });

    return (
      <Switch>
        {allRoutes}
        <Redirect from="*" to="/" key="default-route" />
      </Switch>
    );
  };

  navigateTo = path => {
    const { history } = this.props;
    history.push(path);
  };

  render() {
    const { location } = this.props;
    const vertNavItems = this.menu.map(item => {
      const active = location.pathname === item.to;
      const subItemActive = item.subItems && item.subItems.some(itemB => location.pathname === item.to);
      return (
        <VerticalNavItem
          key={item.to}
          title={item.title}
          iconClass={item.iconClass}
          active={active || subItemActive}
          onClick={() => this.navigateTo(item.to)}
        >
          {item.subItems &&
            item.subItems.map(secondaryItem => (
              <VerticalNavSecondaryItem
                key={secondaryItem.to}
                title={secondaryItem.title}
                iconClass={secondaryItem.iconClass}
                active={secondaryItem.to === location.pathname}
                onClick={() => this.navigateTo(secondaryItem.to)}
              />
            ))}
        </VerticalNavItem>
      );
    });

    return (
      <ApolloProvider client={client}>
        <VerticalNav persistentSecondary={false}>
          <VerticalNavMasthead title="APP-INTERFACE" />
          {vertNavItems}
        </VerticalNav>
        {this.renderContent()}
      </ApolloProvider>
    );
  }
}

App.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export default withRouter(App);
