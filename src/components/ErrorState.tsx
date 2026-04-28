import React from 'react';
import { Alert } from '@patternfly/react-core';

interface ErrorStateProps {
  title: string;
  error: Error | string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ title, error }) => {
  const message = typeof error === 'string' ? error : error.message;

  return (
    <Alert variant="danger" title={title}>
      {message}
    </Alert>
  );
};

export default ErrorState;
