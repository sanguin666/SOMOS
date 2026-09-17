import { apiDelete, apiGet } from './client';
import type { CommunityComment, CommunityPost } from './types';

export function getCommunityPosts(poiId: string): Promise<CommunityPost[]> {
  return apiGet<CommunityPost[]>(`/pois/${poiId}/community-posts`);
}

export function getComments(poiId: string, postId: string): Promise<CommunityComment[]> {
  return apiGet<CommunityComment[]>(`/pois/${poiId}/community-posts/${postId}/comments`);
}

export function deletePost(poiId: string, postId: string): Promise<void> {
  return apiDelete<void>(`/pois/${poiId}/community-posts/${postId}`);
}

export function deleteComment(poiId: string, postId: string, commentId: string): Promise<void> {
  return apiDelete<void>(`/pois/${poiId}/community-posts/${postId}/comments/${commentId}`);
}
