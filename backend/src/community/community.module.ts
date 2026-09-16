import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunityPost } from './entities/community-post.entity.js';
import { CommunityComment } from './entities/community-comment.entity.js';
import { CommunityPostsService } from './community-posts.service.js';
import { CommunityCommentsService } from './community-comments.service.js';
import { CommunityController } from './community.controller.js';
import { PoisModule } from '../pois/pois.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommunityPost, CommunityComment]),
    PoisModule,
  ],
  controllers: [CommunityController],
  providers: [CommunityPostsService, CommunityCommentsService],
  exports: [CommunityPostsService, CommunityCommentsService],
})
export class CommunityModule {}
