import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BookmarkRepository } from './bookmark.repository.interface';
import { Bookmark } from '@prisma/client';

@Injectable()
export class PrismaBookmarkRepository implements BookmarkRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<Bookmark, 'id' | 'created_at'>): Promise<Bookmark> {
    return this.prisma.prisma.bookmark.create({
      data: {
        ...data,
        user_id: BigInt(data.user_id),
        article_id: BigInt(data.article_id),
      },
    });
  }

  async findAll(): Promise<Bookmark[]> {
    return this.prisma.prisma.bookmark.findMany();
  }

  async findById(id: number): Promise<Bookmark | null> {
    return this.prisma.prisma.bookmark.findUnique({
      where: { id: BigInt(id) },
    });
  }

  async update(id: number, data: Partial<Bookmark>): Promise<Bookmark | null> {
    return this.prisma.prisma.bookmark.update({
      where: { id: BigInt(id) },
      data: {
        ...data,
        user_id: data.user_id ? BigInt(data.user_id) : undefined,
        article_id: data.article_id ? BigInt(data.article_id) : undefined,
      },
    });
  }

  async delete(id: number): Promise<Bookmark | null> {
    return this.prisma.prisma.bookmark.delete({ where: { id: BigInt(id) } });
  }

  async deleteMany(): Promise<{ count: number }> {
    return this.prisma.prisma.bookmark.deleteMany();
  }
}
