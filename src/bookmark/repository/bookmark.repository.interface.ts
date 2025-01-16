import { Bookmark } from '@prisma/client';
export const BOOKMARK_REPOSITORY = 'BOOKMARK_REPOSITORY'; // Injection Token 정의

export interface BookmarkRepository {
  create(data: Omit<Bookmark, 'id' | 'created_at'>): Promise<Bookmark>;
  findAll(): Promise<Bookmark[]>;
  findById(id: number): Promise<Bookmark | null>;
  update(id: number, data: Partial<Bookmark>): Promise<Bookmark | null>;
  delete(id: number): Promise<Bookmark | null>;
  deleteMany(): Promise<{ count: number }>;
}
