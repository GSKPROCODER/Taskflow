import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  error: Error | null;
}

/** Class-based boundary that catches render/lazy-load errors in its subtree. */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  reset = () => this.setState({ error: null });

  override render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <ErrorScreen error={this.state.error} onRetry={this.reset} />
        )
      );
    }
    return this.props.children;
  }
}

export function ErrorScreen({
  error,
  onRetry,
}: {
  error?: Error | null;
  onRetry?: () => void;
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10">
        <AlertTriangle className="size-7 text-destructive" />
      </span>
      <div>
        <h1 className="text-lg font-semibold">Something went wrong</h1>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {error?.message ?? "An unexpected error occurred."}
        </p>
      </div>
      <div className="flex gap-3">
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw className="size-4" /> Try again
          </Button>
        )}
        <Button onClick={() => (window.location.href = "/dashboard")}>
          Go to dashboard
        </Button>
      </div>
    </div>
  );
}
