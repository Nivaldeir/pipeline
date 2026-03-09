import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/20 py-10 sm:py-14">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 transition-opacity hover:opacity-90">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary shadow-sm">
              <span className="text-sm font-bold text-primary-foreground">co</span>
            </div>
            <span className="font-semibold">coManager</span>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            <Link
              href="#funcionalidades"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Funcionalidades
            </Link>
            <Link
              href="#como-funciona"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Como Funciona
            </Link>
            <Link
              href="#solicitar"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Solicitar
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Entrar
            </Link>
          </nav>

          <p className="text-xs sm:text-sm text-muted-foreground order-last md:order-none">
            2026 coManager. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
