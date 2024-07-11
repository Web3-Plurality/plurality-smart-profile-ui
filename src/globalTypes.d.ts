export interface PayloadDataType {
    userId: string,
    session: string,
    method: string
}

// Snap Types
export type GetSnapsResponse = Record<string, Snap>;

export type Snap = {
  permissionName: string;
  id: string;
  version: string;
  initialPermissions: Record<string, unknown>;
};
