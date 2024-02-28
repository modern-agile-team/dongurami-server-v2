import { FileValidator } from '@nestjs/common';

export class ParseFileBufferPipe extends FileValidator {
  isValid(file?: Express.Multer.File): boolean {
    return file.size < 500000000000000;
  }

  buildErrorMessage(_file: Express.Multer.File): string {
    return 'file size to big';
  }
}
