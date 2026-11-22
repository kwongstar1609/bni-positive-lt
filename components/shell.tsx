import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Armchair,
  BookOpen,
  CalendarDays,
  ClipboardList,
  FileSpreadsheet,
  Gauge,
  LayoutDashboard,
  ListChecks,
  Menu,
  Mic,
  Users,
  UserRoundPlus,
  X,
} from "lucide-react";
import { Toaster } from "sonner";
import { useChapter } from "@/lib/chapter-store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/members", label: "Members", icon: Users },
  { to: "/lights", label: "Traffic lights", icon: Gauge },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/visitors", label: "Visitors", icon: UserRoundPlus },
  { to: "/applications", label: "Applications", icon: ClipboardList },
  { to: "/seating", label: "Seating", icon: Armchair },
  { to: "/presentations", label: "Presentations", icon: Mic },
  { to: "/reports", label: "Reports", icon: FileSpreadsheet },
  { to: "/manual", label: "How it works", icon: BookOpen },
] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const chapterName = useChapter((s) => s.settings.chapterName);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    void Promise.resolve(useChapter.persist.rehydrate()).finally(() => {
      useChapter.getState().setHydrated(true);
    });
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-bg text-fg md:grid md:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-border bg-surface md:flex md:flex-col">
        <Brand name={chapterName} />
        <Nav pathname={pathname} />
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-surface px-4 py-3 md:hidden">
          <button className="btn-ghost px-3" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <div>
            <p className="font-display text-lg leading-none">{chapterName}</p>
            <p className="text-sm text-muted">Leadership desk</p>
          </div>
        </header>
        {open && (
          <div className="fixed inset-0 z-30 bg-fg/40 md:hidden" onClick={() => setOpen(false)}>
            <div
              className="flex h-full w-[min(100%,280px)] flex-col bg-surface"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 pt-4">
                <Brand name={chapterName} />
                <button className="btn-ghost px-3" onClick={() => setOpen(false)} aria-label="Close menu">
                  <X className="size-5" />
                </button>
              </div>
              <Nav pathname={pathname} />
            </div>
          </div>
        )}
        <main className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
      <Toaster theme="light" />
    </div>
  );
}

function Brand({ name }: { name: string }) {
  return (
    <div className="px-5 py-5">
      <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">Leadership desk</p>
      <p className="font-display text-2xl leading-tight">{name}</p>
    </div>
  );
}

function Nav({ pathname }: { pathname: string }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3 pb-6">
      {NAV.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold",
              active ? "bg-primary text-primary-fg" : "text-fg hover:bg-surface-2",
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
