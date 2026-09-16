import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityPost } from './entities/community-post.entity.js';
import { CommunityComment } from './entities/community-comment.entity.js';
import { PoisService } from '../pois/pois.service.js';
import { CreateCommunityPostDto } from './dto/create-community-post.dto.js';

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
  ) {}

  async create(
    poiId: string,
    dto: CreateCommunityPostDto,
  ): Promise<CommunityPost> {
    const poi = await this.poisService.findOne(poiId);
    const post = this.postsRepository.create({ ...dto, poi });
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
}
