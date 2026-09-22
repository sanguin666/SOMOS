import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityComment } from './entities/community-comment.entity.js';
import { CommunityPostsService } from './community-posts.service.js';
import { CreateCommunityCommentDto } from './dto/create-community-comment.dto.js';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class CommunityCommentsService {
  constructor(
    @InjectRepository(CommunityComment)
    private readonly commentsRepository: Repository<CommunityComment>,
    private readonly postsService: CommunityPostsService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    postId: string,
    authorId: string,
    dto: CreateCommunityCommentDto,
  ): Promise<CommunityComment> {
    const [post, author] = await Promise.all([
      this.postsService.findOne(postId),
      this.usersService.findOne(authorId),
    ]);
    const comment = this.commentsRepository.create({
      ...dto,
      post,
      author: { id: author.id },
      authorName: dto.authorName ?? author.firstName,
    });
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
