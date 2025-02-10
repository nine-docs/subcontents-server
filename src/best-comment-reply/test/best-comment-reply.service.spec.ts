import { Test, TestingModule } from '@nestjs/testing';
import { BestCommentReplyService } from '../best-comment-reply.service';

describe('BestCommentReplyService', () => {
  let service: BestCommentReplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BestCommentReplyService],
    }).compile();

    service = module.get<BestCommentReplyService>(BestCommentReplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
