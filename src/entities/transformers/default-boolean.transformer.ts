import { ValueTransformer } from 'typeorm';

export class DefaultBooleanTransformer implements ValueTransformer {
  constructor(private readonly defaultValue?: boolean) {}

  public from(value?: number): boolean {
    return !!value;
  }

  public to(value?: boolean | undefined): number {
    return Number(value ?? this.defaultValue);
  }
}
