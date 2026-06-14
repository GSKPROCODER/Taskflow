import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LazyMotion } from "framer-motion";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
    },
  },
});

const loadMotionFeatures = () =>
  import("framer-motion").then((m) => m.domAnimation);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LazyMotion features={loadMotionFeatures} strict>
        <Suspense>
          <RouterProvider router={router} />
        </Suspense>
      </LazyMotion>
    </QueryClientProvider>
  </StrictMode>,
);
