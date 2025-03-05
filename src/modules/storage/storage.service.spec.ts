import { StorageService } from './storage.service';
import { unlink } from 'fs';

jest.mock('fs', () => ({
  unlink: jest.fn((path, callback) => callback(null)),
}));

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    service = new StorageService();
  });

  describe('getFilePath', () => {
    it('should return the correct file path', () => {
      const filename = 'test.jpg';
      const expectedPath = service.getFilePath(filename);

      expect(service.getFilePath(filename)).toBe(expectedPath);
    });
  });

  describe('deleteFile', () => {
    it('should call unlink with the correct file path', async () => {
      const filename = 'test.jpg';
      const filePath = service.getFilePath(filename);

      await service.deleteFile(filename);

      expect(unlink).toHaveBeenCalledWith(filePath, expect.any(Function));
    });

    it('should reject if unlink encounters an error', async () => {
      (unlink as unknown as jest.Mock).mockImplementationOnce((path, callback) => callback(new Error('File not found')));

      await expect(service.deleteFile('test.jpg')).rejects.toThrow('File not found');
    });
  });
});
