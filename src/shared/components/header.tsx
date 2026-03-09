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

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-sm">
            <span className="text-primary-foreground font-bold text-sm">co</span>
          </div>
          <span className="font-semibold text-lg">coManager</span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
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
            </>
          ) : (
            <Button asChild>
              <Link href="/login">Entrar</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
