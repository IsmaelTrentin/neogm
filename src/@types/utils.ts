import { NodeSchema } from './schema';

export interface Properties {
  [key: string]: any;
}

export type RelationshipDirection = 'in' | 'out';

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

export type MappedParameters<T extends Properties, S extends string> = {
  [Property in keyof T as `${S}${string & Property}`]: T[Property];
};
