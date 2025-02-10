import { Test, TestingModule } from '@nestjs/testing';
import { BestCommentReplyController } from '../best-comment-reply.controller';

describe('BestCommentReplyController', () => {
  let controller: BestCommentReplyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BestCommentReplyController],
    }).compile();

    controller = module.get<BestCommentReplyController>(
      BestCommentReplyController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
