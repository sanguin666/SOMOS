import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnnouncementsService } from './announcements.service.js';
import { CreateAnnouncementDto } from './dto/create-announcement.dto.js';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto.js';
import { localDiskStorage } from '../common/upload/multer-storage.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PoiAdminGuard } from '../auth/guards/poi-admin.guard.js';

const MAX_AUDIO_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB — a few minutes of voice audio.

@Controller('pois/:poiId/announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  // Accepts multipart/form-data: `title`, optional `body`, optional `audio`
  // file field (a recorded voice message — see the app's ComposeAnnouncementScreen).
  @Post()
  @UseInterceptors(
    FileInterceptor('audio', {
      storage: localDiskStorage('announcements'),
      limits: { fileSize: MAX_AUDIO_SIZE_BYTES },
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.startsWith('audio/')) {
          callback(new UnsupportedMediaTypeException('File must be audio'), false);
          return;
        }
        callback(null, true);
      },
    }),
  )
  create(
    @Param('poiId') poiId: string,
    @Body() dto: CreateAnnouncementDto,
    @UploadedFile() audio?: Express.Multer.File,
  ) {
    return this.announcementsService.create(poiId, dto, audio);
  }

  @Get()
  findForPoi(@Param('poiId') poiId: string) {
    return this.announcementsService.findForPoi(poiId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  update(
    @Param('poiId') poiId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAnnouncementDto,
  ) {
    return this.announcementsService.update(poiId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PoiAdminGuard)
  remove(@Param('poiId') poiId: string, @Param('id') id: string) {
    return this.announcementsService.remove(poiId, id);
  }
}
