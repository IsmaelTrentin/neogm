import { Schema } from './schema';

export interface Properties {
  [key: string]: any;
}

export type GetLabelsTypeFromSchema<S extends Schema> = S extends Schema<
  infer L,
  infer _
>
  ? L
  : never;

export type GetPropertiesTypeFromSchema<S extends Schema> = S extends Schema<
  infer _,
  infer P
>
  ? P
  : never;
