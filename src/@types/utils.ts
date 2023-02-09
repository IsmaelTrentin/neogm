import { Schema, Schemas } from './schema';

export interface Properties {
  [key: string]: any;
}

export type GetIsRelationshipFromSchema<S extends Schemas> = S extends Schema<
  infer IsR,
  infer _L,
  infer _P
>
  ? IsR
  : never;

export type GetLabelsTypeFromSchema<S extends Schemas> = S extends Schema<
  infer _IsR,
  infer L,
  infer _P
>
  ? L
  : never;

export type GetPropertiesTypeFromSchema<S extends Schemas> = S extends Schema<
  infer _IsR,
  infer _L,
  infer P
>
  ? P
  : never;
