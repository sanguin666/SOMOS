import { randomUUID } from 'node:crypto';
import { extname, join, resolve } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import { UnsupportedMediaTypeException } from '@nestjs/common';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface.js';
import { diskStorage, type StorageEngine } from 'multer';

/**
 * Where files that are nobody else's business are written: the documents
 * a family sends with a request (a birth certificate, an ID). Unlike
 * UPLOADS_ROOT, nothing serves this directory as it stands — every file in
 * it is opened through a signed link the API hands out only to the person
 * who sent it and the place's staff (see SignedUrlService).
 *
 * Same local-disk caveat as multer-storage.ts: fine on one server with a
 * persistent volume, to be swapped for private object storage beyond that.
 */
export const PRIVATE_UPLOADS_ROOT = process.env.PRIVATE_UPLOADS_DIR
  ? resolve(process.env.PRIVATE_UPLOADS_DIR)
  : join(process.cwd(), 'uploads-private');

export function privateDiskStorage(subfolder: string): StorageEngine {
  const dir = join(PRIVATE_UPLOADS_ROOT, subfolder);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  return diskStorage({
    destination: dir,
    filename: (_req, file, callback) => {
      callback(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`);
    },
  });
}

const DOCUMENT_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);

const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024; // A phone photo of a page, or a scanned PDF.

/** Multer options for one document: a photo or a PDF, and not a huge one. */
export function documentUploadOptions(subfolder: string): MulterOptions {
  return {
    storage: privateDiskStorage(subfolder),
    limits: { fileSize: MAX_DOCUMENT_SIZE_BYTES },
    fileFilter: (_req, file, callback) => {
      if (!DOCUMENT_MIME_TYPES.has(file.mimetype)) {
        callback(new UnsupportedMediaTypeException('Send a photo or a PDF'), false);
        return;
      }
      callback(null, true);
    },
  };
}
