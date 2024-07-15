import { BaseEntity, CreateEntityProps } from '@src/common/base.entity';

interface MajorProps {
  code: string;
  name: string;
  memo: string;
}

export class Major extends BaseEntity<MajorProps> {
  constructor(props: CreateEntityProps<MajorProps>) {
    super(props);
  }

  public validate(): void {}
}
