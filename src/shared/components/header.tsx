"use client";

import Link from "next/link";
import { useAuth } from "@/shared/context/auth-context";
import { Button } from "@/src/shared/components/ui/button";
import { Avatar, AvatarFallback } from "@/src/shared/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/shared/components/ui/dropdown-menu";
import { getInitials } from "@/shared/utils";
import { LogOut, User, Settings } from "lucide-react";
import Image from "next/image";

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  const firstName = user?.name?.split(" ")[0];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/70">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2.5 shrink-0"
        >
          <Image
            src="/logo.png"
            alt="TATICCA Pipeline"
            width={28}
            height={28}
            className="rounded"
          />
          <span className="text-sm font-semibold tracking-tight text-foreground/90 transition-colors group-hover:text-foreground">
            TATICCA <span className="text-muted-foreground/80">Pipeline</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-9 gap-2 px-1.5 sm:px-2 hover:bg-accent/60"
                  aria-label="Abrir menu do usuário"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium text-foreground/90 sm:inline">
                    {firstName}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">Entrar</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
