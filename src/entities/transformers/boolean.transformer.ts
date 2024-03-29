import { ValueTransformer } from 'typeorm';

export class BooleanTransformer implements ValueTransformer {
  public from(value?: number | null): boolean | undefined {
    return !!value;
  }

  public to(value?: boolean | null): number | undefined {
    return Number(value);
  }
}
