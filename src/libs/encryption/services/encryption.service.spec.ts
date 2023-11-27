import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { BCRYPT_TOKEN } from '@src/libs/encryption/constants/encryption.token';
import bcrypt from 'bcrypt';
import { EncryptionService } from './encryption.service';

describe(EncryptionService.name, () => {
  let service: EncryptionService;
  let libBcrypt: typeof bcrypt;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EncryptionService,
        {
          provide: BCRYPT_TOKEN,
          useValue: bcrypt,
        },
      ],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
    libBcrypt = module.get(BCRYPT_TOKEN);
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

  describe(EncryptionService.prototype.compare.name, () => {
    let data: string;
    let encrypted: string;

    beforeEach(() => {
      data = '';
      encrypted = '';
    });

    it('compare', async () => {
      data = 'data';
      encrypted = 'encrypted';

      jest
        .spyOn(libBcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      await expect(service.compare(data, encrypted)).resolves.toBe(true);
    });
  });
});
