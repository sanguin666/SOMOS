import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoisModule } from '../pois/pois.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { ServiceRequest } from './entities/service-request.entity.js';
import { ServiceRequestMessage } from './entities/service-request-message.entity.js';
import { ServiceRequestDocument } from './entities/service-request-document.entity.js';
import { ServiceRequestsService } from './service-requests.service.js';
import { ServiceRequestsController } from './service-requests.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceRequest, ServiceRequestMessage, ServiceRequestDocument]),
    PoisModule,
    AuthModule,
  ],
  controllers: [ServiceRequestsController],
  providers: [ServiceRequestsService],
})
export class ServiceRequestsModule {}
