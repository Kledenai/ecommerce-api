import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('getHelloServiceCall', () => {
    it('should call the AppService and return the correct message', () => {
      const appServiceMock = jest.spyOn(appService, 'getHello').mockReturnValue('Hello from service!');

      const result = appController.getHello();

      expect(appServiceMock).toHaveBeenCalled();
      expect(result).toBe('Hello from service!');

      appServiceMock.mockRestore();
    });
  });
});
