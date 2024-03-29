const path = require('path');

module.exports = {
  extends: ['plugin:patternfly-react/recommended'],
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'no-console': 'off',
    'react/prop-types': 'off',
    'camelcase': 'off'
  }
};
