import { PartialType } from '@nestjs/mapped-types';
import { CreateAnnouncementDto } from './create-announcement.dto.js';

// Editing an existing announcement's text; re-recording the voice message
// isn't supported yet — delete and recreate for that.
export class UpdateAnnouncementDto extends PartialType(CreateAnnouncementDto) {}
