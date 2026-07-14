import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopNav";
import { fadeUp } from "@/lib/motion";
import { useUIStore } from "@/store/ui.store";

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
  const { sidebarOpen, setSidebarOpen } = useUIStore();

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
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-shrink-0 w-64 border-r border-sidebar-accent bg-sidebar">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm border-r border-sidebar-accent bg-sidebar md:hidden"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
