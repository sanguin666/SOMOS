import { Module } from '@nestjs/common';
import { AuthGuardsModule } from '../auth/auth-guards.module.js';
import { PrivateFilesController } from './private-files.controller.js';

@Module({
  imports: [AuthGuardsModule],
  controllers: [PrivateFilesController],
})
export class PrivateFilesModule {}
