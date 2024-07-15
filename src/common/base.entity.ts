export type EntityId = string;

export interface BaseEntityProps {
  id: EntityId;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateEntityProps<T> = {
  id: EntityId;
  props: T;
  createdAt?: Date;
  updatedAt?: Date;
};

export abstract class BaseEntity<T> {
  private readonly _id: EntityId;

  private readonly _createdAt: Date;

  protected _updatedAt: Date;

  protected readonly _props: T;

  constructor({ id, createdAt, updatedAt, props }: CreateEntityProps<T>) {
    const now = new Date();

    this._id = id;
    this._createdAt = createdAt || now;
    this._updatedAt = updatedAt || now;
    this._props = props;
    this.validate();
  }

  get id() {
    return this._id;
  }

  get props(): T {
    return {
      ...this.props,
    };
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  set updatedAt(value: Date) {
    this._updatedAt = value;
  }

  public abstract validate(): void;
}
