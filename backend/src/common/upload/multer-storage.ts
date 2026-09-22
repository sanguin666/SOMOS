import { randomUUID } from 'node:crypto';
import { extname, join, resolve } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import { diskStorage, type StorageEngine } from 'multer';

/**
 * Where uploaded files (voice messages, a place's page images) are written.
 *
 * Local disk, which is fine for the demo and for a single small server with
 * a persistent volume. It is NOT fine on anything that replaces its disk
 * between deploys or runs more than one instance: the files would vanish or
 * only exist on whichever instance received them. Swap `localDiskStorage`
 * for an S3/Cloudinary engine there — every caller already goes through
 * this module, so nothing else has to change.
 *
 * UPLOADS_DIR moves the directory without a code change, so the files can
 * at least be put on a mounted volume rather than inside the deployment.
 */
export const UPLOADS_ROOT = process.env.UPLOADS_DIR
  ? resolve(process.env.UPLOADS_DIR)
  : join(process.cwd(), 'uploads');

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
