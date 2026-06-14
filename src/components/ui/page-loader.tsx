import { Loader2 } from "lucide-react";

/** Full-viewport spinner shown while a lazy page chunk is loading. */
export function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}
