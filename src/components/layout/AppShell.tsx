import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopNav";
import { fadeUp } from "@/lib/motion";

const MAIN_PAGES = [
  "/dashboard",
  "/projects",
  "/my-tasks",
  "/calendar",
  "/team",
  "/reports",
  "/jira-sync",
  "/slack-feed",
];

/**
 * Authenticated app frame: full-bleed sidebar + topbar over the routed content.
 * Route changes animate via the keyed motion wrapper.
 */
export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const isScrolling = useRef(false);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Removed altKey requirement based on user request.
      // NOTE: This will trigger on any scroll, meaning vertical scrolling inside pages may cause unwanted page jumps.
      if (isScrolling.current) return;

      const currentIndex = MAIN_PAGES.findIndex((p) =>
        location.pathname.startsWith(p),
      );
      if (currentIndex === -1) return;

      // Detect both vertical (mouse wheel) and horizontal (trackpad swipe) scrolling
      if (e.deltaY > 50 || e.deltaX > 50) {
        // Scroll down or right -> next page
        const nextIndex = (currentIndex + 1) % MAIN_PAGES.length;
        isScrolling.current = true;
        navigate(MAIN_PAGES[nextIndex]!);
        setTimeout(() => (isScrolling.current = false), 800); // debounce
      } else if (e.deltaY < -50 || e.deltaX < -50) {
        // Scroll up or left -> prev page
        const prevIndex =
          (currentIndex - 1 + MAIN_PAGES.length) % MAIN_PAGES.length;
        isScrolling.current = true;
        navigate(MAIN_PAGES[prevIndex]!);
        setTimeout(() => (isScrolling.current = false), 800); // debounce
      }
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [location.pathname, navigate]);

  return (
    <div className="flex h-screen overflow-hidden bg-sidebar">
      <div className="flex-shrink-0 w-64 border-r border-sidebar-accent bg-sidebar">
        <Sidebar />
      </div>
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
