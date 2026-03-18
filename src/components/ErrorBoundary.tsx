import React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Chart error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center h-48 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
            <p className="text-2xl mb-2">⚠️</p>
            <p className="font-medium">Chart failed to render</p>
            <p className="text-xs mt-1 text-red-400 dark:text-red-500 max-w-xs text-center">
              {this.state.error?.message ?? "Unknown error"}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-3 text-xs px-3 py-1 border border-red-300 dark:border-red-700 rounded hover:bg-red-100 dark:hover:bg-red-800 transition-colors"
            >
              Retry
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
