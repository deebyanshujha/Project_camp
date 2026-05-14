import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  FileText,
  Folder,
  Home,
} from "lucide-react";
import { cn } from "../utils/helpers";

export default function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", icon: Home, href: "/" },
    { label: "Projects", icon: Folder, href: "/projects" },
    { label: "Analytics", icon: BarChart3, href: "/analytics", disabled: true },
    { label: "Docs", icon: FileText, href: "/docs", disabled: true },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <aside
      className={cn(
        "bg-[#F7FBFF] border-r-4 border-sketch-ink transition-all duration-300 flex flex-col overflow-hidden shadow-sketch",
        isOpen ? "w-64" : "w-20",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b-4 border-sketch-ink">
        {isOpen && (
          <h2 className="font-doodle font-bold text-sketch-ink text-3xl">
            Field Notes
          </h2>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 bg-white rounded-xl transition sketch-btn"
          aria-label="Collapse sidebar"
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-sketch-ink transition-all",
                index % 2 === 0 ? "rotate-[-0.35deg]" : "rotate-[0.35deg]",
                isActive(item.href)
                  ? "bg-sketch-accent text-sketch-ink shadow-sketch-hover"
                  : "bg-white text-gray-700 hover:bg-[#D6ECFF]",
                item.disabled &&
                  "opacity-50 cursor-not-allowed pointer-events-none",
              )}
            >
              <Icon size={20} className="flex-shrink-0" />
              {isOpen && (
                <span className="whitespace-nowrap font-black">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {isOpen && (
        <div className="m-4 p-4 bg-white border-2 border-sketch-ink rounded-2xl shadow-sketch-hover rotate-[-1deg]">
          <p className="font-doodle text-2xl text-sketch-ink">v1.0 sketchbook</p>
          <p className="text-xs text-gray-600 mt-1">Built for messy project brains.</p>
        </div>
      )}
    </aside>
  );
}

