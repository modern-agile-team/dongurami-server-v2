import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionService } from './encryption.service';

describe(EncryptionService.name, () => {
  let service: EncryptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncryptionService],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(EncryptionService.prototype.hash.name, () => {
    let data: string;
    let salt: number;

    beforeEach(() => {
      data = '';
      salt = NaN;
    });

    it('hash', async () => {
      data = 'data';
      salt = faker.number.int({ max: 5 });

      const hashedData = await service.hash(data, salt);

      expect(data).not.toBe(hashedData);
    });
  });

  describe.skip(EncryptionService.prototype.compare.name, () => {
    let data: string;
    let encrypted: string;

    beforeEach(() => {
      data = '';
      encrypted = '';
    });

    it('hash', async () => {
      data = 'data';
      encrypted = 'encrypted';

      const hashedData = await service.compare(data, encrypted);

      expect(data).not.toBe(hashedData);
    });
  });
});
