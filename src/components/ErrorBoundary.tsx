import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full flex-col items-center justify-center p-8 text-center text-rose-600 bg-rose-50 rounded-xl border border-rose-200">
          <h2 className="mb-2 text-lg font-bold">Something went wrong</h2>
          <p className="text-sm font-mono bg-white p-4 rounded border border-rose-100 shadow-sm overflow-auto max-w-full">
            {this.state.error?.message}
          </p>
          <button
            className="mt-4 px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
