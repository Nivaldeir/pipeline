let currentUserId: string | null = null;

export function setTrpcUserId(userId: string | null) {
  currentUserId = userId;
}

export function getTrpcUserId(): string {
  return currentUserId ?? "";
}
