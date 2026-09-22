import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityPost } from './entities/community-post.entity.js';
import { CommunityComment } from './entities/community-comment.entity.js';
import { PoisService } from '../pois/pois.service.js';
import { CreateCommunityPostDto } from './dto/create-community-post.dto.js';
import { UsersService } from '../users/users.service.js';

export type CommunityPostWithCommentCount = CommunityPost & {
  commentCount: number;
};

@Injectable()
export class CommunityPostsService {
  constructor(
    @InjectRepository(CommunityPost)
    private readonly postsRepository: Repository<CommunityPost>,
    @InjectRepository(CommunityComment)
    private readonly commentsRepository: Repository<CommunityComment>,
    private readonly poisService: PoisService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    poiId: string,
    authorId: string,
    dto: CreateCommunityPostDto,
  ): Promise<CommunityPost> {
    const [poi, author] = await Promise.all([
      this.poisService.findOne(poiId),
      this.usersService.findOne(authorId),
    ]);
    const post = this.postsRepository.create({
      ...dto,
      poi,
      author: { id: author.id },
      authorName: dto.authorName ?? author.firstName,
    });
    return this.postsRepository.save(post);
  }

  async findOne(id: string): Promise<CommunityPost> {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Community post ${id} not found`);
    }
    return post;
  }

  async findForPoi(poiId: string): Promise<CommunityPostWithCommentCount[]> {
    const posts = await this.postsRepository.find({
      where: { poi: { id: poiId } },
      order: { createdAt: 'DESC' },
    });

    // Simple per-post count — fine at this scale; revisit with a single
    // grouped query if the community board ever gets busy.
    return Promise.all(
      posts.map(async (post) => ({
        ...post,
        commentCount: await this.commentsRepository.count({
          where: { post: { id: post.id } },
        }),
      })),
    );
  }

  // Moderation: an admin removing a post (and its comments, via cascade).
  async remove(poiId: string, id: string): Promise<void> {
    const post = await this.postsRepository.findOne({
      where: { id, poi: { id: poiId } },
    });
    if (!post) {
      throw new NotFoundException(`Community post ${id} not found`);
    }
    await this.postsRepository.remove(post);
  }
}
