import { Platform } from 'react-native';
import { apiGet, apiPost, apiPostForm } from './client';
import type { Announcement } from './types';

export function getAnnouncements(poiId: string): Promise<Announcement[]> {
  return apiGet<Announcement[]>(`/pois/${encodeURIComponent(poiId)}/announcements`);
}

type CreateAnnouncementInput = {
  title: string;
  body?: string;
  // Local file/blob URI from expo-audio's recorder (recorder.uri), if a
  // voice message was recorded.
  audioUri?: string;
};

// Web's MediaRecorder can produce webm/ogg depending on the browser;
// native (Expo Go) always records m4a with our RecordingPresets. Matching
// the extension to the real mime type keeps the file servable with the
// right Content-Type.
function extensionForMimeType(mimeType: string): string {
  if (mimeType.includes('webm')) return 'webm';
  if (mimeType.includes('ogg')) return 'ogg';
  if (mimeType.includes('mp4') || mimeType.includes('m4a')) return 'm4a';
  return 'audio';
}

export async function createAnnouncement(
  poiId: string,
  input: CreateAnnouncementInput,
): Promise<Announcement> {
  const path = `/pois/${encodeURIComponent(poiId)}/announcements`;

  if (!input.audioUri) {
    return apiPost<Announcement>(path, { title: input.title, body: input.body });
  }

  const formData = new FormData();
  formData.append('title', input.title);
  if (input.body) formData.append('body', input.body);

  if (Platform.OS === 'web') {
    // On web the recorder gives us a blob: URL — turn it back into a real
    // Blob so the browser's own FormData/fetch can send it as a file part.
    const blob = await fetch(input.audioUri).then((r) => r.blob());
    const ext = extensionForMimeType(blob.type || 'audio/webm');
    formData.append('audio', blob, `voice-message.${ext}`);
  } else {
    // React Native's FormData accepts this {uri, name, type} shape as a
    // file part — not a real Blob, but its fetch polyfill knows how to
    // stream it from the local file system.
    formData.append('audio', {
      uri: input.audioUri,
      name: 'voice-message.m4a',
      type: 'audio/m4a',
    } as unknown as Blob);
  }

  return apiPostForm<Announcement>(path, formData);
}
