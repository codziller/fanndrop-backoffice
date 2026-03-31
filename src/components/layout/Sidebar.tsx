import { motion, AnimatePresence } from "framer-motion";
import { useLocation, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Music2,
  Users,
  Shield,
  Megaphone,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { NAV_ITEMS } from "@/utils/constants";
import { cn } from "@/utils/helpers";
import fanndropLogo from "@/assets/fanndrop-logo.svg";
import fanndropLogoBox from "@/assets/fandrop-logo-box.png";

// ─── Icon registry ────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Music2,
  Users,
  Shield,
  Megaphone,
  Settings,
};

// ─── Sidebar widths ───────────────────────────────────────────────────────────

const EXPANDED_W = 256;
const COLLAPSED_W = 64;

// ─── Component ────────────────────────────────────────────────────────────────

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useApp();
  const { user, logout } = useAuth();
  const location = useLocation();

  const width = sidebarCollapsed ? COLLAPSED_W : EXPANDED_W;

  return (
    <motion.aside
      animate={{ width }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="relative flex-shrink-0 flex flex-col h-screen bg-bg-surface border-r border-border-subtle overflow-hidden"
      style={{ width }}
    >
      {/* ── Toggle button ──────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={cn(
          "absolute top-4 right-3 z-10 flex items-center justify-center",
          "w-6 h-6 text-t-subtle hover:text-t-default",
          "hover:bg-surface-hover transition-colors duration-150",
          sidebarCollapsed ? "right-0" : "bg-transparent",
        )}
      >
        {sidebarCollapsed ? (
          <ChevronRight size={16} />
        ) : (
          <ChevronLeft size={16} />
        )}
      </button>

      {/* ── Logo ───────────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex items-center flex-shrink-0 h-16 border-b border-border-subtle",
          sidebarCollapsed ? "justify-center px-0" : "px-5 gap-2.5",
        )}
      >
        {sidebarCollapsed ? (
          <img
            src={fanndropLogoBox}
            alt="Fanndrop"
            className="w-7 h-7 flex-shrink-0 object-contain"
          />
        ) : (
          <img
            src={fanndropLogo}
            alt="Fanndrop"
            className="w-28 h-8 flex-shrink-0 object-contain"
          />
        )}
        <AnimatePresence initial={false}>
          {!sidebarCollapsed && (
            <motion.span
              key="logo-label"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <span className="text-text-sm text-t-subtle">Admin</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ── Nav items ──────────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon];
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/dashboard" &&
                location.pathname.startsWith(item.path));

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    "flex items-center h-10 transition-colors duration-150",
                    "border-l-[3px]",
                    sidebarCollapsed ? "justify-center px-0" : "px-4 gap-3",
                    isActive
                      ? "bg-brand/8 text-brand border-brand"
                      : "text-t-disabled hover:bg-surface-hover hover:text-t-default border-transparent",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {Icon && <Icon size={20} className="flex-shrink-0" />}
                  <AnimatePresence initial={false}>
                    {!sidebarCollapsed && (
                      <motion.span
                        key={`label-${item.path}`}
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden whitespace-nowrap text-text-sm font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── User section ───────────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex-shrink-0 border-t border-border-subtle py-3",
          sidebarCollapsed
            ? "flex flex-col items-center gap-2 px-0"
            : "px-4 flex flex-col gap-2",
        )}
      >
        {/* User info row */}
        <div
          className={cn(
            "flex items-center",
            sidebarCollapsed ? "justify-center" : "gap-2.5",
          )}
        >
          <Avatar name={user?.name ?? "Admin"} size="sm" />
          <AnimatePresence initial={false}>
            {!sidebarCollapsed && (
              <motion.div
                key="user-info"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap min-w-0"
              >
                <p className="text-text-sm font-semibold text-t-bold truncate leading-tight">
                  {user?.name}
                </p>
                <p className="text-text-xs text-t-subtle truncate leading-tight">
                  {user?.role}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logout button */}
        <button
          type="button"
          onClick={logout}
          aria-label="Logout"
          className={cn(
            "flex items-center text-text-sm text-t-subtle hover:text-danger",
            "hover:bg-surface-hover transition-colors duration-150 h-8",
            sidebarCollapsed ? "justify-center w-8" : "gap-2 px-2 w-full",
          )}
        >
          <LogOut size={16} className="flex-shrink-0" />
          <AnimatePresence initial={false}>
            {!sidebarCollapsed && (
              <motion.span
                key="logout-label"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
