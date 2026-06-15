export type LogActivityMeta = {
  userId?: number | null;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export type LogActivityAction = 'create' | 'update' | 'delete' | string;
