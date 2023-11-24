import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class EncryptionService {
  hash(data: string, salt: number) {
    return bcrypt.hash(data, salt);
  }

  compare(data: string, encrypted: string) {
    return bcrypt.compare(data, encrypted);
  }
}
