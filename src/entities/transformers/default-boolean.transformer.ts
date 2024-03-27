import { ValueTransformer } from 'typeorm';

export class DefaultBooleanTransformer implements ValueTransformer {
  constructor(private readonly defaultValue: boolean) {}

  public from(value?: number | null): boolean | undefined {
    return !!value;
  }

  public to(value?: boolean | null | undefined): number {
    return Number(value ?? this.defaultValue);
  }
}
