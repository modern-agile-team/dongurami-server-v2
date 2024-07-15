export interface IBaseMapper<Entity, Schema, Dto = any> {
  toEntity(record: Schema): Entity;

  toPersistence(entity: Entity): Schema;

  toDto(entity: Entity): Dto;
}
