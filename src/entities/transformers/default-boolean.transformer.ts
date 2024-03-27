import { ValueTransformer } from 'typeorm';

export class DefaultBooleanTransformer implements ValueTransformer {
  constructor(private readonly defaultValue: boolean) {}

  public from(value: number | null): boolean | null {
    console.log(value);

    return value === null ? null : !!value;
  }

  public to(value?: boolean): number {
    return Number(value ?? this.defaultValue);
  }
}
