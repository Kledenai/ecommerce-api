import { Injectable } from '@nestjs/common';
import { unlink } from 'fs';
import { join } from 'path';

@Injectable()
export class StorageService {
  getFilePath(filename: string): string {
    return join(__dirname, '..', '..', 'uploads', 'products', filename);
  }

  deleteFile(filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const filePath = this.getFilePath(filename);
      unlink(filePath, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}
