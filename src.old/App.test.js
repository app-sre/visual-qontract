import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { baseName } from './routes';
import App from './App';

it('renders without crashing', () => {
  // Would you like to debug Jest tests in Chrome? See the following note:
  // https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#debugging-tests-in-chrome
  const div = document.createElement('div');
  ReactDOM.render(
    <Router basename={baseName}>
      <App />
    </Router>,
    div
  );
});
