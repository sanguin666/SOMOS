import { randomUUID } from 'node:crypto';
import { extname, join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import { diskStorage, type StorageEngine } from 'multer';

// Local disk storage for the demo — no cloud bucket to configure.
// Swap for S3/Cloudinary (or similar) before any production use.
export const UPLOADS_ROOT = join(process.cwd(), 'uploads');

export function localDiskStorage(subfolder: string): StorageEngine {
  const dir = join(UPLOADS_ROOT, subfolder);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  return diskStorage({
    destination: dir,
    filename: (_req, file, callback) => {
      callback(null, `${randomUUID()}${extname(file.originalname)}`);
    },
  });
}

export function publicUrlFor(subfolder: string, filename: string): string {
  return `/uploads/${subfolder}/${filename}`;
}
