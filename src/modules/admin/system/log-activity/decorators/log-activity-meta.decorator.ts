import { UserEntity } from '@modules/admin/system/user/entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { LogActivityMeta } from '../types/log-activity-meta.type';

type AuthenticatedRequest = Request & {
  user?: UserEntity;
};

export const LogActivityRequestMeta = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): LogActivityMeta => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

    return {
      userId: request.user?.id ?? null,
      ipAddress: getIpAddress(request),
      userAgent: request.headers['user-agent'] ?? null,
    };
  },
);

const getIpAddress = (request: Request): string | null => {
  const forwardedFor = request.headers['x-forwarded-for'];

  if (Array.isArray(forwardedFor)) {
    return forwardedFor[0] ?? null;
  }

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  return request.ip ?? null;
};
