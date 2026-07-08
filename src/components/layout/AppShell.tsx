import { motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopNav";
import { fadeUp } from "@/lib/motion";

/**
 * Authenticated app frame: full-bleed sidebar + topbar over the routed content.
 * Route changes animate via the keyed motion wrapper.
 */
export function AppShell() {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-sidebar">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-background">
          <motion.div
            key={location.pathname}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-[1400px] p-6 lg:p-10"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
