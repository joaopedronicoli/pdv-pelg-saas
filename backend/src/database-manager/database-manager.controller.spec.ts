import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseManagerController } from './database-manager.controller';

describe('DatabaseManagerController', () => {
  let controller: DatabaseManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatabaseManagerController],
    }).compile();

    controller = module.get<DatabaseManagerController>(DatabaseManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
