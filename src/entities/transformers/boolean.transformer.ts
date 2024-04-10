import { ValueTransformer } from 'typeorm';

export class BooleanTransformer implements ValueTransformer {
  constructor(private readonly defaultValue: boolean) {}

  public from(value: number | null): boolean | null {
    return value === null ? null : !!value;
  }

  public to(value?: boolean): number {
    return Number(value ?? this.defaultValue);
  }
}
