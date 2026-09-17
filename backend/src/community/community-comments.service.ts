import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityComment } from './entities/community-comment.entity.js';
import { CommunityPostsService } from './community-posts.service.js';
import { CreateCommunityCommentDto } from './dto/create-community-comment.dto.js';

@Injectable()
export class CommunityCommentsService {
  constructor(
    @InjectRepository(CommunityComment)
    private readonly commentsRepository: Repository<CommunityComment>,
    private readonly postsService: CommunityPostsService,
  ) {}

  async create(
    postId: string,
    dto: CreateCommunityCommentDto,
  ): Promise<CommunityComment> {
    const post = await this.postsService.findOne(postId);
    const comment = this.commentsRepository.create({ ...dto, post });
    return this.commentsRepository.save(comment);
  }

  findForPost(postId: string): Promise<CommunityComment[]> {
    return this.commentsRepository.find({
      where: { post: { id: postId } },
      order: { createdAt: 'ASC' },
    });
  }

  // Moderation: an admin removing a single comment.
  async remove(postId: string, id: string): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: { id, post: { id: postId } },
    });
    if (!comment) {
      throw new NotFoundException(`Comment ${id} not found`);
    }
    await this.commentsRepository.remove(comment);
  }
}
