import { NodeSchema, RelationshipSchema } from './schema';

export interface Properties {
  [key: string]: any;
}

export type GetNodeLabels<S extends NodeSchema> = S extends NodeSchema<
  infer L,
  infer _P
>
  ? L
  : never;

export type GetNodeProperties<S extends NodeSchema> = S extends NodeSchema<
  infer _L,
  infer P
>
  ? P
  : never;

export type GetRelationshipType<S extends RelationshipSchema> =
  S extends RelationshipSchema<infer T, infer _P> ? T : never;

export type GetRelationshipProperties<S extends RelationshipSchema> =
  S extends RelationshipSchema<infer _T, infer P> ? P : never;
