import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { ErrorScreen } from "@/components/ui/error-boundary";

/** errorElement used by react-router data router — catches loader/action errors. */
export function ErrorPage() {
  const err = useRouteError();
  let message: string | undefined;
  if (isRouteErrorResponse(err)) {
    message = `${err.status} ${err.statusText}`;
  } else if (err instanceof Error) {
    message = err.message;
  }
  return <ErrorScreen error={message ? new Error(message) : null} />;
}
