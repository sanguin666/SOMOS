import { Controller, ForbiddenException, Get, NotFoundException, Param, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { existsSync } from 'node:fs';
import { basename, join } from 'node:path';
import { SignedUrlService } from '../common/signed-url/signed-url.service.js';
import { PRIVATE_UPLOADS_ROOT } from '../common/upload/private-storage.js';

/**
 * Opens one private file from a signed link (see SignedUrlService). The
 * link is the only thing checked here: whoever handed it out already
 * decided the caller may see the file.
 */
@Controller('private-files')
export class PrivateFilesController {
  constructor(private readonly signedUrls: SignedUrlService) {}

  @Get(':folder/:file')
  open(
    @Param('folder') folder: string,
    @Param('file') file: string,
    @Query('exp') exp: string | undefined,
    @Query('sig') sig: string | undefined,
    @Query('name') name: string | undefined,
    @Res() response: Response,
  ): void {
    const path = privateFilePath(folder, file);
    if (!this.signedUrls.verify(path, exp, sig)) {
      throw new ForbiddenException('This link has expired');
    }
    // basename() so a crafted name can never walk out of the directory;
    // the signature already covers folder and file, this is belt and braces.
    const onDisk = join(PRIVATE_UPLOADS_ROOT, basename(folder), basename(file));
    if (!existsSync(onDisk)) throw new NotFoundException('File not found');
    // Shown in the browser (a photo, a PDF) rather than forced to download,
    // under the name it was sent with.
    const safeName = (name ?? file).replace(/["\r\n]/g, '');
    response.setHeader('Content-Disposition', `inline; filename="${safeName}"`);
    response.setHeader('Cache-Control', 'private, no-store');
    response.sendFile(onDisk);
  }
}

/** The path a private file's link signs — the part before `?`. */
export function privateFilePath(folder: string, file: string): string {
  return `/private-files/${folder}/${file}`;
}

/**
 * A link that opens a private file for the next hour, for someone the
 * caller has already checked may see it. Relative: the app and the
 * dashboard put their own API base in front.
 */
export function signedPrivateFileUrl(
  signedUrls: SignedUrlService,
  storedPath: string,
  originalName: string | null | undefined,
): string {
  const [folder, file] = storedPath.split('/');
  const signed = signedUrls.sign(privateFilePath(folder, file));
  return originalName ? `${signed}&name=${encodeURIComponent(originalName)}` : signed;
}
