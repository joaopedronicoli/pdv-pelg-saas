import { Module } from '@nestjs/common';
import { DatabaseManagerController } from './database-manager.controller';
import { DatabaseManagerService } from './database-manager.service';

@Module({
  controllers: [DatabaseManagerController],
  providers: [DatabaseManagerService]
})
export class DatabaseManagerModule {}
