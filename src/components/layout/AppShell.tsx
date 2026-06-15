import { ReactNode } from "react";

import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({
  children,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TopNav />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}