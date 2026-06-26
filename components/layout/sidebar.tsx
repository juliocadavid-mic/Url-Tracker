import Link from "next/link";
import { BarChart3, FolderTree, Search, Users } from "lucide-react";

const items = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: BarChart3
  },
  {
    href: "/dashboard",
    label: "Clientes",
    icon: Users
  },
  {
    href: "/dashboard",
    label: "Arquitectura SEO",
    icon: FolderTree
  },
  {
    href: "/dashboard",
    label: "Keywords",
    icon: Search
  }
];

export function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/50 bg-white/70 p-6 backdrop-blur xl:block">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">eMIC SEO OS</p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-950">Agency Command Center</h1>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-900 hover:text-white"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
