import { Platform } from 'react-native';

/** A photo or file the person picked, as expo-image-picker describes it. */
export type PickedFile = {
  uri: string;
  name?: string | null;
  mimeType?: string | null;
};

/**
 * Adds a picked file to a multipart form. On the web the picker hands back
 * a blob: URL to read; on a phone React Native uploads straight from the
 * file's uri, given its name and type.
 */
export async function appendPickedFile(formData: FormData, field: string, file: PickedFile): Promise<void> {
  if (Platform.OS === 'web') {
    const blob = await fetch(file.uri).then((response) => response.blob());
    formData.append(field, blob, file.name ?? `photo.${extensionFor(blob.type)}`);
    return;
  }
  const mimeType = file.mimeType ?? 'image/jpeg';
  formData.append(field, {
    uri: file.uri,
    name: file.name ?? `photo.${extensionFor(mimeType)}`,
    type: mimeType,
  } as unknown as Blob);
}

function extensionFor(mimeType: string): string {
  if (mimeType.includes('pdf')) return 'pdf';
  if (mimeType.includes('png')) return 'png';
  if (mimeType.includes('webp')) return 'webp';
  if (mimeType.includes('heic')) return 'heic';
  return 'jpg';
}
