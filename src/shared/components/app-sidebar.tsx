"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/shared/context/auth-context";
import { cn } from "@/shared/utils";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  FileText,
  Settings,
  PlusCircle,
} from "lucide-react";

const clientLinks = [
  { href: "/cliente", label: "Meus Projetos", icon: FolderKanban },
  { href: "/cliente/solicitar", label: "Solicitar Projeto", icon: PlusCircle },
  { href: "/cliente/configuracoes", label: "Configurações", icon: Settings },
];

const developerLinks = [
  { href: "/desenvolvedor", label: "Projetos", icon: FolderKanban },
  { href: "/desenvolvedor/configuracoes", label: "Configurações", icon: Settings },
];

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projetos", label: "Projetos", icon: FolderKanban },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const links =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "developer"
        ? developerLinks
        : clientLinks;

  return (
    <aside className="fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 border-r border-border bg-background">
      <nav className="flex flex-col gap-1 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      
    </aside>
  );
}
