import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prismaService: PrismaService) {}

  async createComment(articleId: number, userId: number, content: string) {}

  async getComments(articleId: number, cursor: number, limit: number) {}

  async fixComment(commentId: number, userId: number) {}

  async deleteComment(commentId: number, userId: number) {}
}
