// prisma.middleware.ts
import { Prisma } from '@prisma/client';

export const softDeleteMiddleware: Prisma.Middleware = async (params, next) => {
  if (params.model == 'Comment' && params.args.deletedAt === undefined) {
    if (params.action == 'findMany') {
      params.args.where = { ...params.args.where, deletedAt: null };
    }
    if (params.action == 'findUnique') {
      params.args.where = { ...params.args.where, deletedAt: null };
    }
  }
  return next(params);
};
