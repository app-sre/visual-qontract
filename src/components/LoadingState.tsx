import React from 'react';
import { Spinner } from '@patternfly/react-core';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading...' }) => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <Spinner size="lg" />
      <p style={{ marginTop: '1rem' }}>{message}</p>
    </div>
  );
};

export default LoadingState;
