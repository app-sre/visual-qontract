import React from 'react';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  Button,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <EmptyState>
          <EmptyStateHeader
            titleText="Something went wrong"
            icon={<EmptyStateIcon icon={ExclamationCircleIcon} />}
            headingLevel="h1"
          />
          <EmptyStateBody>
            {this.state.error?.message || 'An unexpected error occurred while rendering this page.'}
          </EmptyStateBody>
          <EmptyStateFooter>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Reload page
            </Button>
            <Button variant="link" onClick={() => window.history.back()}>
              Go back
            </Button>
          </EmptyStateFooter>
        </EmptyState>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
