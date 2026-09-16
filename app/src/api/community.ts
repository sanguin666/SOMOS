import { apiGet, apiPost } from './client';
import type { CommunityComment, CommunityPost } from './types';

export function getCommunityPosts(poiId: string): Promise<CommunityPost[]> {
  return apiGet<CommunityPost[]>(`/pois/${encodeURIComponent(poiId)}/community-posts`);
}

export function getCommunityPost(poiId: string, postId: string): Promise<CommunityPost> {
  return apiGet<CommunityPost>(
    `/pois/${encodeURIComponent(poiId)}/community-posts/${encodeURIComponent(postId)}`,
  );
}

export function createCommunityPost(
  poiId: string,
  body: { authorName?: string; message: string },
): Promise<CommunityPost> {
  return apiPost<CommunityPost>(`/pois/${encodeURIComponent(poiId)}/community-posts`, body);
}

export function getComments(poiId: string, postId: string): Promise<CommunityComment[]> {
  return apiGet<CommunityComment[]>(
    `/pois/${encodeURIComponent(poiId)}/community-posts/${encodeURIComponent(postId)}/comments`,
  );
}

export function createComment(
  poiId: string,
  postId: string,
  body: { authorName?: string; message: string },
): Promise<CommunityComment> {
  return apiPost<CommunityComment>(
    `/pois/${encodeURIComponent(poiId)}/community-posts/${encodeURIComponent(postId)}/comments`,
    body,
  );
}
