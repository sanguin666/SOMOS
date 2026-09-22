import { Platform } from 'react-native';
import { apiGet, apiPatch, apiPost, apiPostForm } from './client';
import type { Poi } from './types';

export type RequestCodeResult = {
  expiresInSeconds: number;
  // Present only when the backend has no SMS provider configured, which is
  // the normal state on a development machine. The login screen shows it so
  // the flow can be completed without a real text message arriving.
  devCode?: string;
};

export type Me = {
  id: string;
  phone?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  // Relative path served by the backend (/uploads/avatars/…), or absent
  // for the many people who never set a picture.
  avatarUrl?: string;
  language: string;
  adminPois: Poi[];
  pois: Poi[];
};

export function requestPhoneCode(phone: string): Promise<RequestCodeResult> {
  return apiPost<RequestCodeResult>('/auth/phone/request-code', { phone });
}

export function verifyPhoneCode(
  phone: string,
  code: string,
  firstName?: string,
): Promise<{ accessToken: string }> {
  return apiPost<{ accessToken: string }>('/auth/phone/verify', {
    phone,
    code,
    firstName: firstName?.trim() || undefined,
  });
}

export function getMe(): Promise<Me> {
  return apiGet<Me>('/auth/me');
}

/**
 * The settings menu's name field. Only what changed is sent, and the whole
 * of `me` comes back so the session can be replaced rather than patched.
 */
export function updateMyProfile(profile: {
  firstName?: string;
  lastName?: string;
}): Promise<Me> {
  return apiPatch<Me>('/auth/me', profile);
}

/**
 * The profile picture, from the camera roll or the camera. Same two-sided
 * dance as a voice message: a real Blob on web, React Native's own
 * {uri, name, type} file part everywhere else.
 */
export async function uploadMyAvatar(imageUri: string): Promise<Me> {
  const formData = new FormData();

  if (Platform.OS === 'web') {
    const blob = await fetch(imageUri).then((response) => response.blob());
    formData.append('image', blob, `avatar.${extensionForMimeType(blob.type)}`);
  } else {
    const extension = imageUri.split('.').pop()?.toLowerCase();
    const safeExtension = extension === 'png' ? 'png' : 'jpg';
    formData.append('image', {
      uri: imageUri,
      name: `avatar.${safeExtension}`,
      type: safeExtension === 'png' ? 'image/png' : 'image/jpeg',
    } as unknown as Blob);
  }

  return apiPostForm<Me>('/auth/me/avatar', formData);
}

function extensionForMimeType(mimeType: string): string {
  if (mimeType.includes('png')) return 'png';
  if (mimeType.includes('webp')) return 'webp';
  return 'jpg';
}

// Called whenever a signed-in person opens a place, so "my places" follows
// the account rather than the device. Joining a place you already belong to
// is not an error — the backend returns the existing membership.
export function joinPoi(qrCodeToken: string): Promise<unknown> {
  return apiPost<unknown>('/auth/me/pois', { qrCodeToken });
}
