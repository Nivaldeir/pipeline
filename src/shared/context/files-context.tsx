"use client";

import { createContext, useContext, useCallback, type ReactNode } from "react";
import type { ProjectFile } from "@/shared/types";
import { trpc } from "@/shared/trpc/client";

interface FilesContextType {
  getFilesByProject: (projectId: string) => ProjectFile[];
  addFile: (params: { projectId: string; file: File }) => Promise<void>;
  deleteFile: (id: string) => void;
  getTotalSize: (projectId: string) => number;
}

const FilesContext = createContext<FilesContextType | undefined>(undefined);

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function mapFile(f: Record<string, unknown>): ProjectFile {
  return {
    id: f.id as string,
    projectId: f.projectId as string,
    name: f.name as string,
    url: f.url as string,
    type: f.type as string,
    size: f.size as number,
    uploadedBy: f.uploadedBy as string,
    createdAt: f.createdAt instanceof Date ? f.createdAt : new Date(f.createdAt as string),
  };
}

export function FilesProvider({ children }: { children: ReactNode }) {
  const utils = trpc.useUtils();
  const uploadFile = trpc.file.upload.useMutation({
    onSuccess: (_, variables) =>
      utils.file.byProject.invalidate({ projectId: variables.projectId }),
  });
  const deleteFileMutation = trpc.file.delete.useMutation({
    onSuccess: () => utils.file.byProject.invalidate(),
  });

  const getFilesByProject = useCallback(
    (_projectId: string) => [] as ProjectFile[],
    []
  );
  const addFile = useCallback(
    async ({ projectId, file }: { projectId: string; file: File }) => {
      const buffer = await file.arrayBuffer();
      const base64 = arrayBufferToBase64(buffer);

      uploadFile.mutate({
        projectId,
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        data: base64,
      });
    },
    [uploadFile]
  );
  const deleteFile = useCallback(
    (id: string) => deleteFileMutation.mutate({ id }),
    [deleteFileMutation]
  );
  const getTotalSize = useCallback((_projectId: string) => 0, []);

  return (
    <FilesContext.Provider
      value={{
        getFilesByProject,
        addFile,
        deleteFile,
        getTotalSize,
      }}
    >
      {children}
    </FilesContext.Provider>
  );
}

export function useFiles(projectId?: string) {
  const context = useContext(FilesContext);
  if (context === undefined) {
    throw new Error("useFiles deve ser usado dentro de um FilesProvider");
  }
  const { data: filesData = [] } = trpc.file.byProject.useQuery(
    { projectId: projectId ?? "" },
    { enabled: !!projectId }
  );
  const files: ProjectFile[] = Array.isArray(filesData)
    ? (filesData as Array<Record<string, unknown>>).map(mapFile)
    : [];
  const totalSize = files.reduce((acc, f) => acc + f.size, 0);
  return {
    ...context,
    files: projectId ? files : [],
    getFilesByProject: (pid: string) => (pid === projectId ? files : context.getFilesByProject(pid)),
    getTotalSize: (pid: string) => (pid === projectId ? totalSize : 0),
  };
}
