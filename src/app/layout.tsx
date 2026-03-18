import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/shared/context/auth-context";
import { TRPCProvider } from "@/shared/trpc/trpc-provider";
import { ProjectsProvider } from "@/shared/context/projects-context";
import { ClientsProvider } from "@/shared/context/clients-context";
import { CommentsProvider } from "@/shared/context/comments-context";
import { FilesProvider } from "@/shared/context/files-context";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TATICCA Pipeline - Sistema de Gestão de Projetos",
  description:
    "Centralize a solicitação, organização e acompanhamento dos seus projetos com quadro Kanban interativo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <TRPCProvider>
          <ProjectsProvider>
            <ClientsProvider>
              <CommentsProvider>
                <FilesProvider>
                  {children}
                  <Toaster />
                </FilesProvider>
              </CommentsProvider>
            </ClientsProvider>
          </ProjectsProvider>
          </TRPCProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
