import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CommunityPostsService } from './community-posts.service.js';
import { CommunityCommentsService } from './community-comments.service.js';
import { CreateCommunityPostDto } from './dto/create-community-post.dto.js';
import { CreateCommunityCommentDto } from './dto/create-community-comment.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PoiAdminGuard } from '../auth/guards/poi-admin.guard.js';

@Controller('pois/:poiId/community-posts')
export class CommunityController {
  constructor(
    private readonly postsService: CommunityPostsService,
    private readonly commentsService: CommunityCommentsService,
  ) {}

  @Post()
  create(@Param('poiId') poiId: string, @Body() dto: CreateCommunityPostDto) {
    return this.postsService.create(poiId, dto);
  }

  @Get()
  findForPoi(@Param('poiId') poiId: string) {
    return this.postsService.findForPoi(poiId);
  }

  @Get(':postId')
  findOne(@Param('postId') postId: string) {
    return this.postsService.findOne(postId);
  }

  @Post(':postId/comments')
  createComment(
    @Param('postId') postId: string,
    @Body() dto: CreateCommunityCommentDto,
  ) {
    return this.commentsService.create(postId, dto);
  }

  @Get(':postId/comments')
  findComments(@Param('postId') postId: string) {
    return this.commentsService.findForPost(postId);
  }

  // Moderation.
  @Delete(':postId')
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  removePost(@Param('poiId') poiId: string, @Param('postId') postId: string) {
    return this.postsService.remove(poiId, postId);
  }

  @Delete(':postId/comments/:commentId')
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  removeComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ) {
    return this.commentsService.remove(postId, commentId);
  }
}
