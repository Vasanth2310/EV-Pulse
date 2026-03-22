import { NavLink, useLocation } from "react-router-dom";
import { BarChart3, Globe, Zap, Car, TrendingUp, Database, Activity, Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { to: "/", icon: BarChart3, label: "Overview" },
  { to: "/country", icon: Globe, label: "Country Analysis" },
  { to: "/powertrain", icon: Zap, label: "Powertrain" },
  { to: "/vehicle-mode", icon: Car, label: "Vehicle Modes" },
  { to: "/projections", icon: TrendingUp, label: "Projections" },
  { to: "/optimization", icon: Activity, label: "EV Optimizer" },
  { to: "/data-entry", icon: Database, label: "Data Entry" },
];

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const { isDark, toggle } = useTheme();

  return (
    <>
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-sidebar-foreground">EV Pulse</h1>
            <p className="text-xs text-sidebar-foreground/50">Analytics Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={onNavClick}
            className={({ isActive }) => `sidebar-nav-item ${isActive ? "active" : ""}`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-3">
        <button
          onClick={toggle}
          className="sidebar-nav-item w-full justify-between"
        >
          <span className="flex items-center gap-3">
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </span>
          <div className={`w-8 h-4 rounded-full transition-colors ${isDark ? "bg-primary" : "bg-muted-foreground/30"} relative`}>
            <div className={`w-3 h-3 rounded-full bg-primary-foreground absolute top-0.5 transition-transform ${isDark ? "left-4" : "left-0.5"}`} />
          </div>
        </button>
      </div>
    </>
  );
}

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-sidebar border-b border-sidebar-border flex items-center px-4 gap-3">
        <button onClick={() => setOpen(true)} className="text-sidebar-foreground">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-sidebar-foreground">EV Pulse</span>
        </div>
      </header>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar border-sidebar-border">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex flex-col h-full">
            <SidebarContent onNavClick={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default function Sidebar() {
  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex-col z-50">
      <SidebarContent />
    </aside>
  );
}
