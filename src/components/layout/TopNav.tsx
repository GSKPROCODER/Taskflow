import { Bell } from "lucide-react";

export default function TopNav() {
  return (
    <header className="h-16 border-b bg-white px-6 flex items-center justify-between">
      <div>
        <input
          type="text"
          placeholder="Search..."
          className="border rounded-lg px-3 py-2"
        />
      </div>

      <div className="flex items-center gap-4">
        <Bell size={20} />

        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
          A
        </div>
      </div>
    </header>
  );
}